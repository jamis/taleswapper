// This is an ad-hoc controller, not a stimulus one.

export default class {
  constructor(parent) {
    this.parent = parent;
    this.addEventListeners();
  }

  disconnect() {
    this.removeEventListeners();
  }

  get root() {
    return this.parent.shadow;
  }

  get captionInput() {
    return this.root.querySelector('[name=caption]');
  }

  get altInput() {
    return this.root.querySelector('[name=alt]');
  }

  get ackInput() {
    return this.root.querySelector('[name=ack]');
  }

  addEventListeners() {
    this._onInput = this.onInput.bind(this);
    this._onBlur = this.onBlur.bind(this);
    this._onClick = this.onClick.bind(this);

    this.root.addEventListener('input', this._onInput);
    this.root.addEventListener('focusout', this._onBlur);
    this.root.addEventListener('click', this._onClick);
  }

  removeEventListeners() {
    this.root.removeEventListener('input', this._onInput);
    this.root.removeEventListener('focusout', this._onBlur);
    this.root.removeEventListener('click', this._onClick);
  }

  onInput(event) {
    event.target.dataset.dirty = true;
  }

  onBlur(event) {
    if (event.target.dataset.dirty) {
      const name = event.target.name;
      const value = event.target.value;

      this.parent.update(name, value);

      event.target.dataset.dirty = false;
    }
  }

  onClick(event) {
    if (event.target.classList.contains('remove-image')) {
      event.preventDefault();

      if (confirm('Really remove this image?')) {
        this.parent.remove();
      }
    }
  }
}
