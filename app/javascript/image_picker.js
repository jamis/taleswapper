import { DirectUpload } from "@rails/activestorage"

const MaxImageSizeMB = 2;
const MaxImageSize = MaxImageSizeMB * 1024 * 1024;

export default class {
  constructor(delegate, directUploadUrl) {
    this.delegate = delegate;
    this.directUploadUrl = directUploadUrl;
  }

  showImagePicker() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.addEventListener('change', this.imagePicked.bind(this));
    input.click();
  }

  imagePicked(event) {
    const file = event.target.files[0];
    this.tryUploadFile(file);
  }

  tryUploadFile(file) {
    if (!file.type.startsWith('image/')) {
      alert("That doesn't look like an image. Please choose a different one.");
      return;
    }

    if (file.size > MaxImageSize) {
      alert(`Uploaded files may not be more than ${MaxImageSizeMB}MB.`);
      return;
    }

    this.delegate?.imagePicked(file);

    const promise = this.getImageMetadata(file);

    const upload = new DirectUpload(file, this.directUploadUrl, this);
    upload.create((error, blob) => {
      this.delegate?.imageUploadComplete(error);
      if (error) return;

      promise.then(data => {
        const filename = blob.filename.replace('"', "&quot;");
        const defn = { signed_id: blob.signed_id, filename, width: data.width, height: data.height };
        this.delegate?.imageUploadAvailable(defn);
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
    this.delegate?.imageUploadWillBegin();

    request.upload.addEventListener("progress",
      event => this.directUploadDidProgress(event))
  }

  directUploadDidProgress(event) {
    const pct = Math.round(100 * event.loaded / event.total) + '%';
    this.delegate?.imageUploadDidProgress(pct);
  }
}
