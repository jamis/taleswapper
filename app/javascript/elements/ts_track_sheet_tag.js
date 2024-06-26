export default class TSTrackSheetTag extends HTMLElement {
  constructor() {
    super();
    this.definition = JSON.parse(this.getAttribute('data-definition'));
    this.shadow = this.attachShadow({ mode: "closed" });
    this.rendererServiceName = this.getAttribute('data-renderer');
  }

  connectedCallback() {
    this.getRenderer(renderer => {
      this.shadow.appendChild(renderer.renderTrackSheet(this.definition));
    });
  }

  getRenderer(callback) {
    window.TaleSwapper.Services.lookup(this.rendererServiceName).then(callback);
  }
}
