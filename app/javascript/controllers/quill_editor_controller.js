import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'field', 'container', 'toolbar' ];

  connect() {
    this.containerTarget.innerHTML = this.fieldTarget.value;
    this.quill = new Quill(this.containerTarget,
      { modules: { toolbar: {
          container: [
            [ { header: [ 1, 2, 3, false ] } ],
            [ 'bold', 'italic', 'underline', 'strike', { script: 'sub' }, { script: 'super'} ],
            [ { color: [] }, { background: [] }, { align: [ false, 'center', 'right' ] } ],
            [ 'blockquote', { list: 'ordered' }, { list: 'bullet' }, 'divider' ],
            [ 'link' ]
          ],
          handlers: {
            divider: () => { this.insertDivider() }
          }
        } },
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

  insertDivider() {
    const range = this.quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
  }
}
