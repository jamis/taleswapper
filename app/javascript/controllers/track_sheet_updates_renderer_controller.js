import { constructKeyFrom } from '../utilities';
import { Controller } from "@hotwired/stimulus"
import Handlebars from "handlebars"

export default class extends Controller {
  static targets = [
    'container', 'path', 'missing'
  ];

  connect() {
    this.registerPartials();
    window.TaleSwapper.Services.register('track-sheet-updates-renderer', this);
  }

  disconnect() {
    window.TaleSwapper.Services.unregister('track-sheet-updates-renderer');
    // TODO: unregister all registered partials
  }

  registerPartials() {
    this.handlebars = Handlebars.create();

    this.containerTemplate = this.handlebars.compile(this.containerTarget.innerHTML);
    this.pathTemplate = this.handlebars.compile('{{> path}}');
    this.missingTemplate = this.handlebars.compile('{{> missing}}');

    this.handlebars.registerPartial('path', this.pathTarget.innerHTML);
    this.handlebars.registerPartial('missing', this.missingTarget.innerHTML);
  }

  render(sheet, updates) {
    let updatesMap = this.organizeUpdatesByParent(updates);
    let paths = [];

    updatesMap.forEach((list, parent) => {
      let updates = [];

      for (let update of list) {
        for (let propName in update.child) {
          let context = this.contextFor(sheet, update, propName);
          updates.push(context);
        }
        sheet.applyUpdate(update);
      }

      paths.push({ path: parent, key: constructKeyFrom(parent), updates });
    });

    return this.parseHTML(this.containerTemplate({ paths }));
  }

  renderPathFrame(path, key) {
    return this.parseHTML(this.pathTemplate({ path, key }));
  }

  renderMissing(message, name) {
    return this.parseHTML(this.missingTemplate({ message, name }));
  }

  isMissing(message) {
    return !this[message];
  }

  contextFor(sheet, update, propName) {
    let node = sheet.findParent(update.parent);
    let prop = node[propName] || update.child[propName];

    let message = `contextFor_${update.action}_${prop._type}`;

    if (this[message]) {
      return this[message](propName, prop, update);
    } else {
      return this.missingContext(message, propName);
    }
  }

  missingContext(message, name) {
    console.log('%cMISSING', 'color: red', message, name);
    return { partial: 'missing', update: { message, name } };
  }

  organizeUpdatesByParent(updates) {
    let map = new Map();

    for (let update of updates) {
      let list = map.get(update.parent);
      if (list) {
        list.push(update);
      } else {
        map.set(update.parent, [ update ]);
      }
    }

    return map;
  }

  parseHTML(html) {
    let div = document.createElement('div');
    div.innerHTML = html;

    if (div.children.length > 1) {
      console.log(html);
      throw "template produced too many children";
    }

    return div.children[0];
  }
}
