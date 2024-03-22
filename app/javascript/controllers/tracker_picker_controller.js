import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'view', 'treeTemplate', 'leafTemplate' ];

  prepare(source, mode, callback) {
    this.callback = callback;
    this.viewTarget.innerHTML = '<ul></ul>';
    this.renderTree('Trackers', [], source, mode, this.viewTarget.querySelector('ul'));
  }

  renderTree(label, path, node, mode, container) {
    let tree = this.cloneTemplate(this.treeTemplateTarget);
    let labelSlot = tree.querySelector('.label-slot');
    labelSlot.innerHTML = label;

    let labelDiv = labelSlot.closest('.label');
    labelDiv.dataset.path = JSON.stringify(path);

    if (mode == 'add' || mode == 'pick-any') {
      if (path.length > 0) {
        labelSlot.classList.add('ts-link');
        labelSlot.classList.add('cursor-pointer');
        labelSlot.classList.add('tree');
      }
    } else {
      labelSlot.closest('.group').classList.remove('group');
    }

    let childrenSlot = tree.querySelector('.children-slot');

    for (let prop in node) {
      if (node[prop]._type) {
        this.renderLeaf(prop, path, node[prop], mode, childrenSlot);
      } else {
        this.renderTree(prop, [ ...path, prop ], node[prop], mode, childrenSlot);
      }
    }

    container.appendChild(tree);
  }

  renderLeaf(label, path, node, mode, container) {
    let leaf = this.cloneTemplate(this.leafTemplateTarget);
    let labelSlot = leaf.querySelector('.label-slot');
    labelSlot.innerHTML = label;

    if (mode == 'add') {
      labelSlot.classList.add('text-gray-400');
    } else {
      labelSlot.classList.add('leaf');
      labelSlot.classList.add('ts-link');
      labelSlot.classList.add('cursor-pointer');
      labelSlot.dataset.path = JSON.stringify(path);
      labelSlot.dataset.source = JSON.stringify(node);
    }

    container.append(leaf);
  }

  cloneTemplate(template) {
    return template.content.cloneNode(true);
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
    let label = reference.closest('.label');
    let toggle = label.querySelector('.toggle');
    let list = label.nextElementSibling;
    let state = label.dataset.state;

    if (mode == 'open' || (!mode && label.dataset.state == 'closed')) {
      label.dataset.state = 'open';
      toggle.innerHTML = '[-]';
      list.classList.remove('hidden');
    } else {
      label.dataset.state = 'closed';
      toggle.innerHTML = '[+]';
      list.classList.add('hidden');
    }
  }

  leafClicked(leaf) {
    let path = JSON.parse(leaf.dataset.path);
    let source = JSON.parse(leaf.dataset.source);
    let value = leaf.innerHTML;
    this.callback(path, value, source);
  }

  treeClicked(labelSlot) {
    let label = labelSlot.closest('.label');
    let path = JSON.parse(label.dataset.path);
    this.callback(path);
  }

  addGroupClicked(link) {
    let name = prompt('Choose a name for the group');
    if (!name) return;

    let label = link.closest('.label');
    let path = JSON.parse(label.dataset.path);
    let list = label.nextElementSibling;

    this.renderTree(name, [ ...path, name ], {}, 'add', list);
    this.toggleClicked(link, 'open');
  }
}
