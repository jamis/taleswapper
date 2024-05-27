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
  static targets = [
    'view', 'treeTemplate', 'leafTemplate',
    'searchBox', 'searchResults'
  ];

  initialize() {
    this.handlebars = Handlebars.create();

    this.treeTemplate = this.handlebars.compile(this.treeTemplateTarget.innerHTML);

    this.handlebars.registerPartial('tree', this.treeTemplateTarget.innerHTML);
    this.handlebars.registerPartial('leaf', this.leafTemplateTarget.innerHTML);
  }

  prepare(source, mode, callback) {
    // reset the search state
    delete this.corpus;
    this.searchBoxTarget.value = '';
    this.searchResultsTarget.classList.add('hidden');
    this.viewTarget.classList.remove('hidden');

    this.callback = callback;
    this.source = source;
    this.mode = mode;

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

  searchClicked(event) {
    if (event.target.nodeName != 'LI') return;

    event.preventDefault();

    if (event.target.dataset.source) {
      this.leafClicked(event.target);
    } else {
      this.treeClicked(event.target);
    }
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
    let value = leaf.dataset.name || leaf.innerHTML;
    this.callback(this.savedPath, value, source);
  }

  treeClicked(node) {
    let pathNode = node.closest('[data-path]');
    this.savedPath = JSON.parse(pathNode.dataset.path);
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

  updateSearch(event) {
    let needle = event.target.value.trim();

    if (needle.length === 0) {
      this.searchResultsTarget.classList.add('hidden');
      this.viewTarget.classList.remove('hidden');
      return;
    }

    this.searchResultsTarget.classList.remove('hidden');
    this.searchResultsTarget.innerHTML = '';

    this.viewTarget.classList.add('hidden');

    let pattern = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/, '.*'), 'i');

    this.buildCorpus();

    let matches = 0;
    for (let item of this.corpus) {
      if (pattern.test(item.key)) {
        matches += 1;
        let li = document.createElement('li');
        li.innerHTML = item.key;
        li.classList.add('cursor-pointer');
        li.classList.add('even:bg-blue-50');
        li.classList.add('odd:bg-blue-100');
        li.classList.add('opacity-50');
        li.classList.add('hover:opacity-100');
        li.dataset.path = JSON.stringify(item.path);
        li.dataset.name = item.prop;
        if (item.source) li.dataset.source = JSON.stringify(item.source);
        this.searchResultsTarget.append(li);
      }
    }

    if (matches === 0) {
      this.searchResultsTarget.innerHTML = '<li>No matches</li>';
    }
  }

  buildCorpus() {
    if (this.corpus) return;

    this.corpus = [];
    this.buildCorpusFor([], this.source);
  }

  buildCorpusFor(path, node) {
    for (let prop in node) {
      if (node[prop]._type) {
        if (this.mode === 'pick' || this.mode === 'pick-any') {
          this.corpus.push({ key: [ ...path, prop ].join('.'), path, prop, source: node[prop] });
        }
      } else {
        if (this.mode === 'add' || this.mode === 'pick-any') {
          let subpath = [ ...path, prop ];
          this.corpus.push({ key: subpath.join('.'), path: subpath });
        }
        this.buildCorpusFor([ ...path, prop ], node[prop]);
      }
    }
  }
}
