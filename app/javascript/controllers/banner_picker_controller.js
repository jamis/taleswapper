import { Controller } from "@hotwired/stimulus"
import ImagePicker from "../image_picker";

export default class extends Controller {
  static targets = [ 'button', 'blobField', 'progressBar' ];

  static values = {
    directUploadUrl: String,
  };

  submit(event) {
    this.element.requestSubmit();
  }

  pickNew(event) {
    new ImagePicker(this, this.directUploadUrlValue).showImagePicker();
  }

  imagePicked(file) {
    // could show the file name, if desired
  }

  imageUploadComplete(error) {
    if (error) alert(error);
  }

  imageUploadAvailable(data) {
    this.progressBarTarget.classList.replace('block', 'hidden');
    this.buttonTarget.innerHTML = this.savedLabel;
    this.buttonTarget.disabled = false;
    this.buttonTarget.classList.remove('cursor-not-allowed');

    this.blobFieldTarget.value = data.signed_id;
    this.element.requestSubmit();
  }

  imageUploadWillBegin() {
    this.savedLabel = this.buttonTarget.innerHTML;
    this.buttonTarget.innerHTML = "Uploading...";
    this.buttonTarget.disabled = true;
    this.buttonTarget.classList.add('cursor-not-allowed');
    this.progressBarTarget.classList.replace('hidden', 'block');
    this.progressBarTarget.style.width = "0%";
  }

  imageUploadDidProgress(pct) {
    this.progressBarTarget.style.width = pct;
  }
}
