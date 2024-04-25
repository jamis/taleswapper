import TSEmbeddedTag from './ts_embedded_tag';
import TrackSheetEditorController from '../controllers/track_sheet_editor_controller';

export default class TrackerUpdatesTag extends TSEmbeddedTag {
  constructor() {
    super();
    this.updates = JSON.parse(this.getAttribute('data-updates'));
  }

  connectedCallback() {
    super.connectedCallback();
    this.installControllers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
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

  installControllers() {
    if (this.mode == 'edit') {
      this.controller = new TrackSheetEditorController(this);
    }
  }

  saveUpdates(updates) {
    this.setAttribute('data-updates', JSON.stringify(updates));
  }
}
