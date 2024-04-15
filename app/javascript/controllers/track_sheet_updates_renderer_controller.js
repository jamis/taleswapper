import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    'container', 'path', 'missing'
  ];

  connect() {
    window.TaleSwapper.Services.register('track-sheet-updates-renderer', this);
  }

  disconnect() {
    window.TaleSwapper.Services.unregister('track-sheet-updates-renderer');
  }

  render(sheet, updates) {
    let container = this.renderContainer();
    let containerContent = container.querySelector('.content');

    let updatesMap = this.organizeUpdatesByParent(updates);

    updatesMap.forEach((list, parent) => {
      let pathContainer = this.renderPathContainer(parent);
      let pathContainerContent = pathContainer.querySelector('.content');
      containerContent.appendChild(pathContainer);
      for (let update of list) {
        for (let propName in update.child) {
          let node = this.renderUpdate(sheet, update, propName);
          pathContainerContent.appendChild(node);
        }
        sheet.applyUpdate(update);
      }
    });

    return container;
  }

  instantiate(templateTarget, mappings = {}) {
    let template = templateTarget.content.cloneNode(true);

    for (let key in mappings) {
      let selector = `.content--${key}`;
      let element = template.querySelector(selector);
      if (!element) continue;

      if (element.tagName.toLowerCase() === 'input') {
        if (element.getAttribute('type') === 'checkbox') {
          element.checked = mappings[key];
        } else {
          element.value = mappings[key];
        }
      } else {
        element.innerHTML = mappings[key];
      }
    }

    return template;
  }

  renderContainer() {
    return this.instantiate(this.containerTarget);
  }

  renderPathContainer(parent) {
    let name = parent.join(' &rarr; ');
    return this.instantiate(this.pathTarget, { name });
  }

  renderMissing(message, name) {
    console.log('%cMISSING', 'color: red', message, name);
    return this.instantiate(this.missingTarget, { message, name });
  }

  renderUpdate(sheet, update, propName) {
    let node = sheet.findParent(update.parent);
    let prop = node[propName] || update.child[propName];

    let message = `renderUpdate_${update.action}_${prop._type}`;

    if (this[message]) {
      return this[message](propName, prop, update);
    } else {
      return this.renderMissing(message, propName);
    }
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
}
