export default class Storage {
  constructor(namespace = '') {
    this.ns = namespace;
  }
  _key(key) {
    return `${this.ns}:${key}`;
  }
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(this._key(key));
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
    } catch (e) {}
  }
  remove(key) {
    try {
      localStorage.removeItem(this._key(key));
    } catch (e) {}
  }
}
