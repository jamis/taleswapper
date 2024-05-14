import { Controller } from "@hotwired/stimulus"
import ImagePicker from "../image_picker";

export default class extends Controller {
  static targets = [ 'blobField' ];

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
    this.blobFieldTarget.value = data.signed_id;
    this.element.requestSubmit();
  }

  imageUploadWillBegin() {
    // set up a progress bar or something, if desired
  }

  imageUploadDidProgress(pct) {
    // update the progress bar, if desired
  }
}
