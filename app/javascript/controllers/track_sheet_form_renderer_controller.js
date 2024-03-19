import { Controller } from "@hotwired/stimulus"
import { constructKeyFrom, dig } from 'utilities'

function populateTemplate(template, values) {
  for(let key in values) {
    template.querySelectorAll('.' + key).forEach(match => {
      if (values[key] != null)
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

    // 2. get the paths (leave the natural sorting)
    let groups = Object.keys(grouped);

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
          let child = update.child[name];

          // 1. get the info for the item
          let info = child._type ? child : node[name];

          // 2. render the item
          let item = this.renderItem(update.action, { name, value: Object.hasOwn(child, 'value') ? child.value : child, defn: info }, frame);

          // 3. set the update on the item
          // FIXME: handle the case of multiple children in a single update
          item.dataset.update = JSON.stringify(update);
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
      let body = frameTemplate;

      if (action == 'add') {
        body = body.querySelector('.ts-body');
        body.innerHTML = "";

        let selector = frameTemplate.querySelector('.ts-type');
        selector.value = type;
      }

      this[`renderItem_${action}_${type}`](info, body);
    }

    container.appendChild(frameTemplate);

    return frameTemplate;
  }

  renderItem_add_bool(info, container) {
    let body = cloneTemplate(this.addBoolTarget, 'ts-body');
    populateTemplate(body, { 'ts-name': info.name });
    body.querySelector('[type=checkbox]').checked = info.value;
    container.appendChild(body);
  }

  renderItem_add_card(info, container) {
    let body = cloneTemplate(this.addCardTarget, 'ts-body');
    populateTemplate(body, { 'ts-name': info.name, 'ts-value': info.value });
    container.appendChild(body);
  }

  renderItem_add_string(info, container) {
    let body = cloneTemplate(this.addStringTarget, 'ts-body');
    populateTemplate(body, { 'ts-name': info.name, 'ts-value': info.value });
    container.appendChild(body);
  }

  renderItem_add_int(info, container) {
    let body = cloneTemplate(this.addIntTarget, 'ts-body');
    populateTemplate(body, { 'ts-name': info.name, 'ts-value': info.value });
    container.appendChild(body);
  }

  renderItem_update_int(info, container) {
    this.renderItem_update_value(info, container);
  }

  renderItem_update_string(info, container) {
    this.renderItem_update_value(info, container);
  }

  renderItem_update_value(info, container) {
    let body = cloneTemplate(this.updateValueTarget, 'ts-body');
    populateTemplate(body, { 'ts-name': info.name, 'ts-original-value': info.defn.value });
    let input = body.querySelector('.ts-value');
    input.placeholder = info.defn.value;
    if (info.value) input.innerHTML = info.value;
    container.appendChild(body);
  }
}
