const NO_PROPAGATION_EVENTS = [
  'keyup', 'keydown', 'keypress',
  'mousedown', 'mouseup', 'click', 'mousemove',
  'drop', 'dragstart', 'dragover', 'dragend',
  'touchstart', 'touchend', 'touchmove', 'touchcancel', 'longpress',
  'remove', 'blur', 'focus', 'focusin', 'focusout', 'compositionstart', 'compositionend',
  'beforeinput', 'input', 'change', 'cut', 'copy', 'paste', 'contextmenu',
  'reset', 'submit'
];

export default class TSEmbeddedTag extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "closed" });
  }

  connectedCallback() {
    this.determineMode();

    if (this.mode == 'edit') {
      this.setAttribute('contenteditable', false);
    }

    this.installListeners();
    this.maybeWaitToRender();
  }

  disconnectedCallback() {
    this.removeListeners();
  }

  installListeners() {
    this._stopPropagation = this.stopPropagation.bind(this);

    NO_PROPAGATION_EVENTS.forEach(eventName =>
      this.shadow.addEventListener(eventName, this._stopPropagation));
  }

  removeListeners() {
    NO_PROPAGATION_EVENTS.forEach(eventName =>
      this.shadow.removeEventListener(eventName, this._stopPropagation));
  }

  determineMode() {
    this.mode = this.closest('.editor') ? 'edit' : 'display';
  }

  // disallow this event from escaping the shadow DOM.
  stopPropagation(event) {
    event.stopPropagation();
  }

  maybeWaitToRender() {
    if (document.readyState != 'complete') {
      window.addEventListener('load', this.render.bind(this), { once: true });
    } else {
      this.render();
    }
  }
}
