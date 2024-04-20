import TrackSheetEditorController from '../controllers/track_sheet_editor_controller';

const NO_PROPAGATION_EVENTS = [
  'keyup', 'keydown', 'keypress',
  'mousedown', 'mouseup', 'click', 'mousemove',
  'drop', 'dragstart', 'dragover', 'dragend',
  'touchstart', 'touchend', 'touchmove', 'touchcancel', 'longpress',
  'remove', 'blur', 'focus', 'focusin', 'focusout', 'compositionstart', 'compositionend',
  'beforeinput', 'input', 'change', 'cut', 'copy', 'paste', 'contextmenu',
  'reset', 'submit'
];

export default class TrackerUpdatesTag extends HTMLElement {
  constructor() {
    super();
    this.updates = JSON.parse(this.getAttribute('data-updates'));
    this.shadow = this.attachShadow({ mode: "closed" });
  }

  connectedCallback() {
    this.determineMode();

    if (this.mode == 'edit') {
      this.setAttribute('contenteditable', false);
    }

    this.installListeners();
    this.installControllers();
    this.maybeWaitToRender();
  }

  disconnectedCallback() {
    this.removeListeners();
    this.controller?.disconnect();
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

  withTrackSheet(callback, include = false) {
    this.getTrackSheetManager(manager => {
      let sheet = manager.trackSheetAt(this, include);
      callback(sheet);
    });
  }

  render() {
    this.getRenderer(renderer => {
      this.withTrackSheet(sheet => {
        this.shadow.textContent = '';
        let node = renderer.render(sheet, this.updates);
        this.shadow.appendChild(node);
      });
    });
  }

  getRenderer(callback) {
    window.TaleSwapper.Services.lookup('track-sheet-updates-renderer').then(callback);
  }

  getTrackSheetManager(callback) {
    window.TaleSwapper.Services.lookup('track-sheet-manager').then(callback);
  }

  maybeWaitToRender() {
    if (document.readyState != 'complete') {
      window.addEventListener('load', this.render.bind(this), { once: true });
    } else {
      this.render();
    }
  }

  determineMode() {
    this.mode = this.closest('.editor') ? 'edit' : 'display';
  }

  installControllers() {
    if (this.mode == 'edit') {
      this.controller = new TrackSheetEditorController(this);
    }
  }

  saveUpdates(updates) {
    this.setAttribute('data-updates', JSON.stringify(updates));
  }

  // disallow this event from escaping the shadow DOM.
  stopPropagation(event) {
    event.stopPropagation();
  }
}
