export default class {
  register(parent, key) {
    this.draftsFor(parent).register(key);
  }

  unregister(parent, key) {
    this.draftsFor(parent).unregister(key);
  }

  draftsFor(parent) {
    return new DraftCollection(parent);
  }
}

class DraftCollection {
  constructor(key) {
    this.key = `drafts:${key}`;

    let list = localStorage.getItem(this.key);
    if (!list) {
      this.list = [];
    } else {
      this.list = list.split(',');
    }
  }

  timestampFor(draft) {
    return localStorage.getItem(`${draft}:stamp`);
  }

  register(draft) {
    if (!this.list.includes(draft)) {
      this.list.push(draft);
      this.saveList();
    }

    let stamp = Date.now();
    localStorage.setItem(`${draft}:stamp`, stamp);
  }

  unregister(draft) {
    let idx = this.list.indexOf(draft);
    if (idx < 0) return;

    this.list.splice(idx, 1);
    this.saveList();

    localStorage.removeItem(`${draft}:stamp`);
  }

  saveList() {
    localStorage.setItem(this.key, this.list.join(','));
  }
}
