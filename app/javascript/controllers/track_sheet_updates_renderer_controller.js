import { Controller } from "@hotwired/stimulus"
import Handlebars from "handlebars"

export default class extends Controller {
  static targets = [
    'container', 'path', 'missing'
  ];

  static values = {
    serviceName: { type: String, default: 'track-sheet-updates-renderer' },
  };

  connect() {
    this.registerPartials();
    window.TaleSwapper.Services.register(this.serviceNameValue, this);
  }

  disconnect() {
    window.TaleSwapper.Services.unregister(this.serviceNameValue);
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
    let elements = [] ;

    updatesMap.forEach(list => {
      let updates = [];
      let parent = list[0].parent;

      for (let update of list) {
        if (update.action === 'remove') {
          for (let propName of update.child) {
            let context = this.contextFor_remove(propName, update);
            updates.push(context);
          }
        } else {
          for (let propName in update.child) {
            let context = this.contextFor(sheet, update, propName);
            updates.push(context);
          }
        }
        sheet.applyUpdate(update);
      }

      elements.push({ path: parent, elements: updates });
    });

    return this.parseHTML(this.containerTemplate({ elements }));
  }

  renderPathFrame(path) {
    return this.parseHTML(this.pathTemplate({ path }));
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
    let message = `contextFor_${update.action}`;

    if (update.action != 'rename')
      message += `_${prop._type}`;

    if (this[message]) {
      if (update.action === 'rename')
        return this[message](propName, update);
      else
        return this[message](propName, prop, update);
    } else {
      return this.missingContext(message, propName);
    }
  }

  missingContext(message, name) {
    console.log('%cMISSING', 'color: red', message, name);
    return { partial: 'missing', data: { message, name } };
  }

  organizeUpdatesByParent(updates) {
    let map = new Map();

    for (let update of updates) {
      let key = JSON.stringify(update.parent);
      let list = map.get(key);
      if (list) {
        list.push(update);
      } else {
        map.set(key, [ update ]);
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
