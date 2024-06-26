import { Controller } from "@hotwired/stimulus"
import ImagePicker from "../image_picker";
import DOMPurify from "dompurify";
import RTF from "../rtf"

const AsideFormatter = 'ts-aside-formatter';
const BlockParagraphFormatter = 'ts-block-paragraph-formatter';

const AsideButton = 'ts-aside-btn';
const TrackerUpdatesButton = 'ts-tracker-updates-btn';
const TrackerButton = 'ts-tracker-btn';
const ImageButton = 'ts-image-btn';
const BlockParagraphButton = 'ts-block-para-btn';

function prepareSelection(path, value) {
  if (value) {
    return { path, target: value };
  } else {
    let target = path.pop();
    return { path, target };
  }
}

export default class extends Controller {
  static targets = [
    "toolbar", "editor", "content", "loadingIndicator",
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
    if (this.hasLoadingIndicatorTarget) {
      this.loadingIndicatorTarget.remove();
    }

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

      extended_valid_elements: `ts-tracker-updates[id|class|data-updates],ts-image[id|signed-id|filename|alt|caption|ack|width|height],ts-tracker[id|data-path|data-target]`,
      custom_elements: 'ts-tracker-updates,ts-image,ts-tracker',

      setup: this.setupEditor.bind(this),

      plugins: 'link lists save',
      toolbar: `save | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | ${BlockParagraphButton} | numlist bullist | forecolor backcolor | link ${ImageButton} | ${AsideButton} ${TrackerUpdatesButton} ${TrackerButton}`,
      menubar: false,

      save_onsavecallback: () => this.element.requestSubmit(),
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
    editor.on('paste', this.handlePaste.bind(this));
    editor.on('drop', this.handleDrop.bind(this));
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

    this.editor.ui.registry.addButton(TrackerUpdatesButton, {
      icon: 'user',
      tooltip: 'Insert Tracker Updates',
      onAction: () => {
        // TODO: ensure we create a new block context here (or are
        // already in a clean block context) before we insert this
        // tag.
        this.editor.insertContent('<ts-tracker-updates data-updates="[]"></ts-tracker-updates>');
      }
    });

    this.editor.ui.registry.addButton(TrackerButton, {
      icon: 'info',
      tooltip: 'Show a Tracker',
      onAction: () => {
        this.getTrackerPicker(picker => {
          this.getTrackSheetManager(manager => {
            const sheet = manager.trackSheetAt(this.editor.selection.getNode());
            picker.open(sheet.source, 'pick-any', (path, value) => {
              picker.close();

              const selection = prepareSelection(path, value);
              let node = document.createElement('ts-tracker');
              node.dataset.path = JSON.stringify(selection.path);
              node.dataset.target = JSON.stringify(selection.target);

              this.editor.insertContent(node.outerHTML);
            });
          });
        });
      }
    });

    this.editor.ui.registry.addButton(ImageButton, {
      icon: 'image',
      tooltip: 'Insert an image',
      onAction: this.showImagePicker.bind(this)
    });
  }

  getTrackerPicker(callback) {
    window.TaleSwapper.Services.lookup('trackerPicker').then(callback);
  }

  getTrackSheetManager(callback) {
    window.TaleSwapper.Services.lookup('track-sheet-manager').then(callback);
  }

  get imagePicker() {
    return new ImagePicker(this, this.directUploadUrlValue);
  }

  showImagePicker() {
    this.imagePicker.showImagePicker();
  }

  imagePicked(file) {
    this.filenameTarget.textContent = file.name;
  }

  imageUploadComplete(error) {
    this.progressDialogTarget.classList.replace('block', 'hidden');

    if (error) alert(error);
  }

  imageUploadAvailable(data) {
    const defn = `<ts-image signed-id="${data.signed_id}" filename="${data.filename}" width="${data.width}" height="${data.height}"></ts-image>`;
    this.editor.insertContent(defn);
  }

  imageUploadWillBegin() {
    this.progressDialogTarget.classList.replace('hidden', 'block');
    this.progressBarTarget.style.width = "0%";
    this.progressPercentTarget.textContent = "0%";
  }

  imageUploadDidProgress(pct) {
    this.progressBarTarget.style.width = pct;
    this.progressPercentTarget.textContent = pct;
  }

  handlePaste(event) {
    let html, rtf, plain, image;
    Array.from(event.clipboardData.items).forEach(item => {
      if (item.type === "text/html") html = item;
      else if (item.type === "text/rtf") rtf = item;
      else if (item.type === "text/plain") plain = item;
      else if (item.type.startsWith("image/")) image = item;
      else console.log('clipboard data', item, 'has type', item.type);
    });

    if (html || rtf || plain) {
      event.preventDefault();

      if (html) return this.handleHtmlPaste(html);
      if (rtf) return this.handleRtfPaste(rtf);
      return this.handlePlainPaste(plain);

    } else if (image) {
      event.preventDefault();
      return this.handleImagePaste(image);
    }
  }

  handleHtmlPaste(html) {
    html.getAsString(string => {
      const result = DOMPurify.sanitize(string);
      this.insertHTMLContent(result);
    });
  }

  handleRtfPaste(rtf) {
    rtf.getAsString(string => {
      const html = RTF.toHTML(string);
      this.insertHTMLContent(html);
    });
  }

  handlePlainPaste(text) {
    text.getAsString(string => {
      const html = string.replaceAll(/[^\n]+/g, match => `<p>${match}</p>`);
      this.insertHTMLContent(html);
    });
  }

  handleImagePaste(image) {
    const file = image.getAsFile();
    this.imagePicker.tryUploadFile(file);
  }

  handleDrop(event) {
    // we *could* allow multiple images to be dragged at once, but the upload
    // progress dialog isn't configured for that yet. For now, just accept the
    // first dropped image.
    const image = Array.from(event.dataTransfer.items).find(item => {
      return item.type.startsWith('image/');
    });

    if (!image) return;

    event.preventDefault();
    const file = image.getAsFile();
    this.tryUploadFile(file);
  }

  insertHTMLContent(html) {
    this.editor.insertContent(html);
  }
}
