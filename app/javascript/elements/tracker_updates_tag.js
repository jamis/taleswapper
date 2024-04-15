export default class TrackerUpdatesTag extends HTMLElement {
  constructor() {
    super();
    this.updates = JSON.parse(this.getAttribute('data-updates'));
    this.shadow = this.attachShadow({ mode: "closed" });
  }

  connectedCallback() {
    if (document.readyState != 'complete') {
      window.addEventListener('load', this.render.bind(this));
    } else {
      this.render();
    }
  }

  disconnectedCallback() {
  }

  withTrackSheet(callback) {
    this.getTrackSheetManager(manager => {
      let sheet = manager.trackSheetAt(this);
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
}
