import { Controller } from "@hotwired/stimulus"

const AsideFormatter = 'ts-aside-formatter';
const AsideButton = 'ts-aside-btn';
const TrackerButton = 'ts-tracker-btn';

export default class extends Controller {
  static targets = [ "toolbar", "editor" ];

  static values = {
    headerSelector: String
  };

  connect() {
    let header = document.querySelector(this.headerSelectorValue);
    let height = header.clientHeight;

    this.toolbarTarget.style.top = `${height}px`;

    tinymce.init({
      license_key: 'gpl',
      promotion: false,

      target: this.editorTarget,
      inline: true,

      fixed_toolbar_container_target: this.toolbarTarget,
      toolbar_persist: true,

      extended_valid_elements: 'ts-tracker-updates[class,data-updates]',
      custom_elements: 'ts-tracker-updates',

      setup: this.setupEditor.bind(this),

      toolbar: `${AsideButton} ${TrackerButton}`
    });
  }

  disconnect() {
    if (this.editor) {
      tinymce.remove(this.editor);
    }
  }

  initEditorInstance(editor) {
    this.setupAsideFeature(editor);
  }

  setupEditor(editor) {
    this.editor = editor;

    editor.on('init', this.initEditorInstance.bind(this));
  }

  setupAsideFeature() {
    this.editor.formatter.register(AsideFormatter,
      { block: 'aside', wrapper: true }
    );

    this.editor.ui.registry.addButton(AsideButton, {
      text: 'Aside',
      onAction: () => {
        this.editor.formatter.toggle(AsideFormatter);
      }
    });

    this.editor.ui.registry.addButton(TrackerButton, {
      text: 'Trackers',
      onAction: () => {
        // TODO: ensure we create a new block context here (or are
        // already in a clean block context) before we insert this
        // tag.
        this.editor.insertContent('<ts-tracker-updates data-updates="[]"></ts-tracker-updates>');
      }
    });
  }
}
