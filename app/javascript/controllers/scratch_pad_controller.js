import { Controller } from "@hotwired/stimulus"

const throttleWindow = 3000; // 3 seconds

export default class extends Controller {
  static targets = [ "text", "form" ];

  connect() {
    this.textTarget.focus();
  }

  autosave() {
    if (!this.timeoutPending) {
      this.timeoutPending = setTimeout(() => this.saveForm(), throttleWindow);
    }
  }

  saveForm() {
    if (this.timeoutPending) clearTimeout(this.timeoutPending);
    delete this.timeoutPending;
    this.formTarget.submit();
  }

  close() {
    if (this.timeoutPending) this.saveForm();
    setTimeout(() => this.element.remove(), 0);
  }
}
