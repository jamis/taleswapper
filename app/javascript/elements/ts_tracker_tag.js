import TSEmbeddedTag from './ts_embedded_tag';

// <ts-tracker data-path="[&ldquo;Wulan&rdquo,&ldquo;Momentum&rdquo;]"></ts-tracker>

export default class TSTrackerTag extends TSEmbeddedTag {
  render() {
    const path = JSON.parse(this.getAttribute('data-path'));
    const target = JSON.parse(this.getAttribute('data-target'));
    const service = this.closest('[data-display-renderer]').dataset.displayRenderer;

    this.getRenderer(service, renderer => {
      this.getTrackSheetManager(manager => {
        const sheet = manager.trackSheetAt(this);
        const source = {};

        let node = sheet.source;
        let current = source;
        for (let entry of path) {
          current[entry] = {};
          current = current[entry];
          node = node[entry];
        }

        current[target] = node[target];

        this.shadow.appendChild(renderer.renderTrackSheet(source));
      });
    });
  }

  getRenderer(service, callback) {
    window.TaleSwapper.Services.lookup(service).then(callback);
  }

  getTrackSheetManager(callback) {
    window.TaleSwapper.Services.lookup('track-sheet-manager').then(callback);
  }
}
