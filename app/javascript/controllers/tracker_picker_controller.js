import { Controller } from "@hotwired/stimulus"
import Handlebars from "handlebars"

function prefixEq(a, b) {
  if (!a || !b) return false;

  const length = Math.min(a.length, b.length);

  for (let i = 0; i < length; i++) {
    if (a[i] != b[i]) return false;
  }

  return true;
}

export default class extends Controller {
  static targets = [ 'view', 'treeTemplate', 'leafTemplate' ];

  initialize() {
    this.handlebars = Handlebars.create();

    this.treeTemplate = this.handlebars.compile(this.treeTemplateTarget.innerHTML);

    this.handlebars.registerPartial('tree', this.treeTemplateTarget.innerHTML);
    this.handlebars.registerPartial('leaf', this.leafTemplateTarget.innerHTML);
  }

  prepare(source, mode, callback) {
    this.callback = callback;

    let context = this.treeContext('Trackers', [], source, mode)
    this.viewTarget.innerHTML = '<ul>' + this.treeTemplate(context) + '</ul>';
  }

  treeContext(label, path, node, mode) {
    let matched = (path.length == 0) || prefixEq(this.savedPath, path);

    let context = {
      label,
      partial: 'tree',
      state: matched ? 'open' : 'closed',
      toggle: matched ? '[-]' : '[+]',
      childrenVisibility: matched ? '' : 'hidden',
      path: JSON.stringify(path)
    };

    if (mode == 'add' || mode == 'pick-any') {
      if (path.length > 0) {
        context.labelClasses = 'ts-link cursor-pointer tree';
      }
      context.labelGroup = 'group';
    }

    context.children = [];
    for (let prop in node) {
      if (node[prop]._type) {
        context.children.push(this.leafContext(prop, path, node[prop], mode));
      } else {
        context.children.push(this.treeContext(prop, [ ...path, prop ], node[prop], mode));
      }
    }

    return context;
  }

  leafContext(label, path, node, mode) {
    let context = {
      label,
      partial: 'leaf'
    };

    if (mode == 'add') {
      context.classList = 'text-gray-400';
    } else {
      context.classList = 'leaf ts-link cursor-pointer';
      context.path = JSON.stringify(path);
      context.source = JSON.stringify(node);
    }

    return context;
  }

  viewClicked(event) {
    event.preventDefault();

    if (event.target.classList.contains('toggle'))
      this.toggleClicked(event.target);
    else if (event.target.classList.contains('leaf'))
      this.leafClicked(event.target);
    else if (event.target.classList.contains('tree'))
      this.treeClicked(event.target);
    else if (event.target.classList.contains('add-group'))
      this.addGroupClicked(event.target);
  }

  toggleClicked(reference, mode) {
    let root = reference.closest('[data-state]');
    let toggle = root.querySelector('.toggle');
    let list = root.nextElementSibling;
    let state = root.dataset.state;

    if (mode == 'open' || (!mode && root.dataset.state == 'closed')) {
      root.dataset.state = 'open';
      toggle.innerHTML = '[-]';
      list.classList.remove('hidden');
    } else {
      root.dataset.state = 'closed';
      toggle.innerHTML = '[+]';
      list.classList.add('hidden');
    }
  }

  leafClicked(leaf) {
    this.savedPath = JSON.parse(leaf.dataset.path);
    let source = JSON.parse(leaf.dataset.source);
    let value = leaf.innerHTML;
    this.callback(this.savedPath, value, source);
  }

  treeClicked(labelSlot) {
    let label = labelSlot.closest('.label');
    this.savedPath = JSON.parse(label.dataset.path);
    this.callback(this.savedPath);
  }

  addGroupClicked(link) {
    let name = prompt('Choose a name for the group');
    if (!name) return;

    let group = link.closest('.group');
    let path = JSON.parse(group.dataset.path);
    let list = group.nextElementSibling;

    const context = this.treeContext(name, [ ...path, name ], {}, 'add');
    const html = this.treeTemplate(context);
    list.insertAdjacentHTML('beforeend', html);

    this.toggleClicked(link, 'open');
  }
}
