import TSEmbeddedTag from './ts_embedded_tag';
import ImageEditorController from '../controllers/image_editor_controller';
import Handlebars from "handlebars"

export default class TSImageTag extends TSEmbeddedTag {
  constructor() {
    super();
    this.metadata = JSON.parse(this.getAttribute('metadata'));
  }

  connectedCallback() {
    super.connectedCallback();
    this.installController();
  }

  disconnectedCallback() {
    this.controller?.disconnect();
  }

  render() {
    const templateTag = document.getElementById('tsImageTagTemplate');
    const template = Handlebars.compile(templateTag.innerHTML);
    const context = {
      src: this.getAttribute('src'),
      alt: this.getAttribute('alt'),
      ack: this.getAttribute('ack'),
      caption: this.getAttribute('caption'),
      width: this.metadata.width,
      height: this.metadata.height,
    };

    this.shadow.innerHTML = template(context);
  }

  installController() {
    if (this.mode == 'edit') {
      this.controller = new ImageEditorController(this);
    }
  }

  update(attr, value) {
    this.setAttribute(attr, value);
  }
}
