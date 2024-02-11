import { Controller } from "@hotwired/stimulus"
import Drafts from "../drafts"

export default class extends Controller {
  static targets = [ "field" ];

  static values = {
    uuid: String,
    parent: String
  };

  connect() {
    this.pendingUpdates = {};
    this.fieldTargets.forEach(field => this.initializeField(field));
  }

  initializeField(field) {
    let key = this.keyFor(field);
    let snapshot = localStorage.getItem(key);
    if (snapshot) field.value = snapshot;
  }

  snapshot(event) {
    let target = event.target;
    let name = this.nameFor(target);

    if (this.pendingUpdates[name]) {
      clearTimeout(this.pendingUpdates[name]);
    }

    this.pendingUpdates[name] = setTimeout(() => this.update(target), 1000);
  }

  update(target) {
    new Drafts().register(this.parentValue, this.uuidValue);

    let value = target.value;
    localStorage.setItem(this.keyFor(target), value);
  }

  discard(event) {
    if (!confirm("Discard this draft? You won't be able to recover it.")) {
      event.preventDefault();
      return;
    }

    new Drafts().unregister(this.parentValue, this.uuidValue);
    this.fieldTargets.forEach(field => {
      localStorage.removeItem(this.keyFor(field));
      localStorage.removeItem(this.keyFor(field, "stamp"));
    });
  }

  nameFor(field) {
    let name = field.name;
    let match = name.match(/\[(\w+)\]$/);
    return match ? match[1] : name;
  }

  keyFor(field, suffix) {
    let name = this.nameFor(field);
    let key = `${this.uuidValue}:${name}`;
    if (suffix) key += ":" + suffix;
    return key;
  }
}
