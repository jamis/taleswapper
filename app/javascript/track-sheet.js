export default class {
  constructor(source) {
    this.source = structuredClone(source);
  }

  applyUpdate(update) {
    if (update.action == 'add')
      return this.applyAddUpdate(update);
    if (update.action == 'update')
      return this.applyUpdateUpdate(update);
    if (update.action == 'remove')
      return this.applyRemoveUpdate(update);

    throw `not an acceptable update action: '${update.action}'`;
  }

  applyAddUpdate(update) {
    let node = this.findParent(update.parent);
    Object.assign(node, update.child);
  }

  applyUpdateUpdate(update) {
    let node = this.findParent(update.parent);
    for (let prop in update.child) {
      node[prop].value = update.child[prop];
    }
  }

  applyRemoveUpdate(update) {
    let node = this.findParent(update.parent);
    for (let child of update.child) {
      delete node[child];
    }
  }

  findParent(path) {
    let node = this.source;

    for (let name of path) {
      node[name] ||= {};
      node = node[name];
    }

    return node;
  }
}
