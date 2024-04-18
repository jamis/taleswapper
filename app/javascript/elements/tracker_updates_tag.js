import TrackSheetEditorController from 'controllers/track_sheet_editor_controller';

export default class TrackerUpdatesTag extends HTMLElement {
  constructor() {
    super();
    this.updates = JSON.parse(this.getAttribute('data-updates'));
    this.shadow = this.attachShadow({ mode: "closed" });
  }

  connectedCallback() {
    this.determineMode();
    this.installControllers();
    this.maybeWaitToRender();
  }

  disconnectedCallback() {
    this.controller?.disconnect();
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
}
