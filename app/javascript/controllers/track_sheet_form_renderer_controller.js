import { Controller } from "@hotwired/stimulus"
import { constructKeyFrom, dig } from 'utilities'

function populateTemplate(template, values) {
  for(let key in values) {
    template.querySelectorAll('.' + key).forEach(match => {
      match.innerHTML = values[key];
    })
  }
}

function cloneTemplate(template, rootClass) {
  return template.content.cloneNode(true).querySelector('.' + rootClass);
}

function groupUpdates(updates) {
  let group = {};

  for (let update of updates) {
    let key = update.parent.join(' -> ');
    group[key] ||= [];
    group[key].push(update);
  }

  return group;
}

export default class extends Controller {
  static targets = [
    'pathFrame',
    'addFrame', 'addInt', 'addString', 'addBool', 'addCard',
    'updateFrame', 'updateValue', 'updateBool', 'updateCard',
    'removeFrame', 'removeInt', 'removeString', 'removeBool', 'removeCard' ];

  static values = {
    name: String
  };

  connect() {
    window.TaleSwapper.Services.register(this.nameValue, this);
  }

  disconnect() {
    window.TaleSwapper.Services.unregister(this.nameValue);
  }

  render(updates, source, container) {
    // 1. group updates by path
    let grouped = groupUpdates(updates);

    // 2. sort result by path
    let groups = Object.keys(grouped).sort();

    // 3. for each path
    for (let key of groups) {
      // a. render the path frame
      let updates = grouped[key];
      let path = updates[0].parent;
      let node = dig(source, path);
      let pathKey = constructKeyFrom(path);
      let frame = this.renderPathFrame(path, pathKey, container).querySelector('.ts-updates');

      // b. for each item in the path:
      for (let update of updates) {
        for (let name in update.child) {
          // 1. get the info for the item
          let info = node[name];

          // 2. render the item
          this.renderItem(update.action, { name, value: update.child[name], defn: info }, frame);
        }
      }
    }
  }

  renderPathFrame(path, pathKey, container) {
    let template = cloneTemplate(this.pathFrameTarget, 'ts-frame');
    template.dataset.parent = JSON.stringify(path);
    template.dataset.parentKey = pathKey;
    populateTemplate(template, { 'ts-path-label': path.join(' -> ') });
    container.appendChild(template);

    return template;
  }

  renderItem(action, info, container) {
    let frameTemplate = cloneTemplate(this[`${action}FrameTarget`], 'ts-frame');

    if (info) {
      let type = info.defn._type;
      this[`renderItem_${action}_${type}`](info, frameTemplate);
    }

    container.appendChild(frameTemplate);

    return frameTemplate;
  }

  renderItem_update_int(info, container) {
    this.renderItem_update_value(info, container);
  }

  renderItem_update_string(info, container) {
    this.renderItem_update_value(info, container);
  }

  renderItem_update_value(info, container) {
    let body = cloneTemplate(this.updateValueTarget, 'ts-body');
    populateTemplate(body, { 'ts-label': info.name, 'ts-original-value': info.defn.value });
    let input = body.querySelector('.ts-input');
    input.placeholder = info.defn.value;
    if (info.value) input.value = info.value;
    container.appendChild(body);
  }
}
