import { Controller } from "@hotwired/stimulus"
import { DirectUpload } from "@rails/activestorage"

const AsideFormatter = 'ts-aside-formatter';
const BlockParagraphFormatter = 'ts-block-paragraph-formatter';

const AsideButton = 'ts-aside-btn';
const TrackerButton = 'ts-tracker-btn';
const ImageButton = 'ts-image-btn';
const BlockParagraphButton = 'ts-block-para-btn';

const MaxImageSizeMB = 2;
const MaxImageSize = MaxImageSizeMB * 1024 * 1024;

const IDElements = new Set([ 'P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ]);

export default class extends Controller {
  static targets = [
    "toolbar", "editor", "content",
    "progressDialog", "filename", "progressBar", "progressPercent"
  ];

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

      extended_valid_elements: `ts-tracker-updates[id|class|data-updates],ts-image[id|signed-id|filename|alt|caption|ack|width|height]`,
      custom_elements: 'ts-tracker-updates,ts-image',

      setup: this.setupEditor.bind(this),

      plugins: 'link lists',
      toolbar: `bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | ${BlockParagraphButton} | numlist bullist | forecolor backcolor | link ${ImageButton} | ${AsideButton} ${TrackerButton}`,
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

  initEditorInstance(event) {
    this.setupFeatures(event.target);
  }

  setupEditor(editor) {
    this.editor = editor;

    editor.on('init', this.initEditorInstance.bind(this));
    editor.on('NewBlock', this.onNewBlock.bind(this));
  }

  setupFeatures() {
    this.editor.formatter.register(AsideFormatter,
      { block: 'aside', wrapper: true }
    );

    this.editor.formatter.register(BlockParagraphFormatter,
      { block: 'p', classes: 'ts--block-para' }
    );

    this.editor.ui.registry.addToggleButton(AsideButton, {
      icon: 'comment',
      tooltip: 'Toggle Aside Block',
      onAction: () => {
        this.editor.formatter.toggle(AsideFormatter);
      },
      onSetup: (api) => {
        // set the initial state of the button depending on the initial cursor position
        api.setActive(this.editor.formatter.match(AsideFormatter));
        // set up the handler to listen for changes in format as the cursor moves
        const handler = this.editor.formatter.formatChanged(AsideFormatter, (state) => api.setActive(state));
        // return the teardown function that unbinds the event listener
        return () => handler.unbind();
      },
    });

    this.editor.ui.registry.addToggleButton(BlockParagraphButton, {
      icon: 'paragraph',
      tooltip: 'Toggle Indented vs Block Paragraph',
      onAction: () => {
        this.editor.formatter.toggle(BlockParagraphFormatter);
      },
      onSetup: (api) => {
        api.setActive(this.editor.formatter.match(BlockParagraphFormatter));
        const handler = this.editor.formatter.formatChanged(BlockParagraphFormatter, (state) => api.setActive(state));
        return () => handler.unbind();
      },
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

  onNewBlock(event) {
    if (IDElements.has(event.newBlock.tagName)) {
      const prefix = event.newBlock.tagName.toLowerCase();
      event.newBlock.id = `${prefix}_${Date.now()}`;
    }
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

    if (!file.type.startsWith('image/')) {
      alert("That doesn't look like an image. Please choose a different one.");
      return;
    }

    if (file.size > MaxImageSize) {
      alert(`Uploaded files may not be more than ${MaxImageSizeMB}MB.`);
      return;
    }

    this.filenameTarget.textContent = file.name;

    const promise = this.getImageMetadata(file);

    const upload = new DirectUpload(file, this.directUploadUrlValue, this);
    upload.create((error, blob) => {
      this.progressDialogTarget.classList.replace('block', 'hidden');

      if (error) {
        alert(error);
        return;
      }

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

  directUploadWillStoreFileWithXHR(request) {
    this.progressDialogTarget.classList.replace('hidden', 'block');
    this.progressBarTarget.style.width = "0%";
    this.progressPercentTarget.textContent = "0%";

    request.upload.addEventListener("progress",
      event => this.directUploadDidProgress(event))
  }

  directUploadDidProgress(event) {
    const pct = Math.round(100 * event.loaded / event.total) + '%';
    this.progressBarTarget.style.width = pct;
    this.progressPercentTarget.textContent = pct;
  }
}
