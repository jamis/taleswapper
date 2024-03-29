import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'field', 'container', 'toolbar' ];

  static outlets = [ 'scroll-listener' ];

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

    this.toolbarState = null;
    this.toolbar = this.quill.getModule('toolbar').container;
    this.toolbarHeight = this.toolbar.clientHeight;

    this.scrollListenerOutlet.register(this);
    this.quill.on('text-change', () => this.waitToCaptureEditorContents());
  }

  disconnect() {
    if (this.hasScrollListenerOutlet) {
      this.scrollListenerOutlet.unregister(this);
    }
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

  releaseToolbar() {
    this.toolbarStatus = 'released';
    this.toolbar.style.position = 'static';
    this.containerTarget.style.marginTop = '0px';
  }

  fixToolbar(headerHeight, toBottom) {
    this.containerTarget.style.marginTop = this.toolbarHeight + 'px';
    this.toolbar.style.width = this.toolbar.clientWidth + 'px';

    if (toBottom) {
      this.toolbarStatus = null;
      this.toolbar.style.position = 'absolute';
      this.toolbar.style.top = (this.element.clientHeight - this.toolbarHeight) + 'px';
    } else {
      this.toolbarStatus = 'fixed';
      this.toolbar.style.position = 'fixed';
      this.toolbar.style.top = headerHeight + 'px';
    }
  }
}
