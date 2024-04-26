import TSEmbeddedTag from './ts_embedded_tag';
import ImageEditorController from '../controllers/image_editor_controller';
import Handlebars from "handlebars"
import { marked } from "marked";
import DOMPurify from "dompurify";

export default class TSImageTag extends TSEmbeddedTag {
  constructor() {
    super();
    this.metadata = JSON.parse(this.getAttribute('metadata'));
    this.handlebars = Handlebars.create();

    this.handlebars.registerHelper('md', function(markdown) {
      return new Handlebars.SafeString(DOMPurify.sanitize(marked.parse(markdown)));
    });
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
    const template = this.handlebars.compile(templateTag.innerHTML);
    const context = {
      signed_id: this.getAttribute('signed-id'),
      filename: this.getAttribute('filename'),
      url: this.buildUrl(),
      alt: this.getAttribute('alt'),
      ack: this.getAttribute('ack'),
      caption: this.getAttribute('caption'),
      width: this.getAttribute('width'),
      height: this.getAttribute('height')
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

  buildUrl() {
    const signedId = this.getAttribute('signed-id');
    const filename = this.getAttribute('filename');
    const template = document.querySelector('meta[name=ts-image-url-pattern]').getAttribute('value');

    return template.
      replaceAll(':signed-id:', signedId).
      replaceAll(':filename:', filename);
  }
}
