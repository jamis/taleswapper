import { Controller } from "@hotwired/stimulus"
import { DirectUpload } from "@rails/activestorage"

const AsideFormatter = 'ts-aside-formatter';
const AsideButton = 'ts-aside-btn';
const TrackerButton = 'ts-tracker-btn';
const ImageButton = 'ts-image-btn';

export default class extends Controller {
  static targets = [ "toolbar", "editor", "content" ];

  static values = {
    headerSelector: String,
    directUploadUrl: String,
  };

  connect() {
    this.editorTarget.innerHTML = this.contentTarget.value;

    // since tinymce is only loaded in edit mode, we need to wait for the
    // script to finish loading before we actually try and do anything
    // with it.
    if (!window.tinymce) {
      let script = document.querySelector('#tinymceScript');
      script.addEventListener('load', this.onLoad.bind(this), { once: true });
    } else {
      this.onLoad();
    }
  }

  onLoad() {
    let header = document.querySelector(this.headerSelectorValue);
    let height = header.clientHeight;

    this.toolbarTarget.style.top = `${height}px`;

    tinymce.init({
      license_key: 'gpl',
      promotion: false,

      target: this.editorTarget,
      inline: true,
      hidden_input: false,

      fixed_toolbar_container_target: this.toolbarTarget,
      toolbar_persist: true,

      extended_valid_elements: 'ts-tracker-updates[class|data-updates],ts-image[signed-id|filename|alt|caption|ack|width|height]',
      custom_elements: 'ts-tracker-updates,ts-image',

      setup: this.setupEditor.bind(this),

      plugins: 'link lists',
      toolbar: `bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | numlist bullist | forecolor backcolor | link ${ImageButton} | ${AsideButton} ${TrackerButton}`,
      menubar: false,
    });
  }

  disconnect() {
    if (this.editor) {
      tinymce.remove(this.editor);
    }
  }

  finalize() {
    if (this.editor) {
      this.contentTarget.value = this.editor.getContent();
    }
  }

  initEditorInstance(editor) {
    this.setupFeatures(editor);
  }

  setupEditor(editor) {
    this.editor = editor;

    editor.on('init', this.initEditorInstance.bind(this));
  }

  setupFeatures() {
    this.editor.formatter.register(AsideFormatter,
      { block: 'aside', wrapper: true }
    );

    this.editor.ui.registry.addButton(AsideButton, {
      icon: 'comment',
      tooltip: 'Toggle Aside Block',
      onAction: () => {
        this.editor.formatter.toggle(AsideFormatter);
      }
    });

    this.editor.ui.registry.addButton(TrackerButton, {
      icon: 'user',
      tooltip: 'Insert Tracker Updates',
      onAction: () => {
        // TODO: ensure we create a new block context here (or are
        // already in a clean block context) before we insert this
        // tag.
        this.editor.insertContent('<ts-tracker-updates data-updates="[]"></ts-tracker-updates>');
      }
    });

    this.editor.ui.registry.addButton(ImageButton, {
      icon: 'image',
      tooltip: 'Insert an image',
      onAction: this.showImagePicker.bind(this)
    });
  }

  showImagePicker() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.addEventListener('change', this.imagePicked.bind(this));
    input.click();
  }

  // <ts-image src="..." alt="..." caption="..." ack="..."></ts-image>
  imagePicked(event) {
    const file = event.target.files[0];
    const promise = this.getImageMetadata(file);

    const upload = new DirectUpload(file, this.directUploadUrlValue);
    upload.create((error, blob) => {
      promise.then(data => {
        // TODO: ensure we create a new block context here (or are
        // already in a clean block context) before we insert this
        // tag.
        const filename = blob.filename.replace('"', "&quot;");
        const defn = `<ts-image signed-id="${blob.signed_id}" filename="${filename}" width="${data.width}" height="${data.height}"></ts-image>`;
        this.editor.insertContent(defn);
      });
    });
  }

  getImageMetadata(file) {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.addEventListener('load', () => {
        URL.revokeObjectURL(img.src);
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const ratio = width / height;
        resolve({ width, height, ratio });
      });
    });
  }
}
