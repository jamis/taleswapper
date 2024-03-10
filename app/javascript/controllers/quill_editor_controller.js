import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'field', 'container' ];

  connect() {
    this.containerTarget.innerHTML = this.fieldTarget.value;
    this.quill = new Quill(this.containerTarget,
      { modules: { toolbar: [
          [ 'bold', 'italic', 'underline', 'strike', 'roll' ],
          [ 'blockquote' ],
          [ 'link', 'formula' ],
          [ 'divider' ]
        ] },
        theme: 'snow' });

    this.quill.on('text-change', () => this.waitToCaptureEditorContents());
  }

  waitToCaptureEditorContents() {
    if (this.pendingTimeout) window.clearTimeout(this.pendingTimeout);
    this.pendingTimeout = window.setTimeout(() => this.captureEditorContents(), 250);
  }

  captureEditorContents() {
    this.fieldTarget.value = this.quill.getSemanticHTML();
  }
}
