export default class {
  constructor() {
    this.services = {};
  }

  register(key, impl) {
    if (this.services[key]?.resolve) {
      this.services[key].resolve(impl);
    }

    this.services[key] = { impl };
  }

  unregister(key) {
    delete this.services[key];
  }

  lookup(key) {
    if (this.services[key]?.impl) {
      return new Promise(resolve => resolve(this.services[key].impl));
    } else if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].promise = new Promise(resolve => { this.services[key].resolve = resolve });
    }

    return this.services[key].promise;
  }
}
