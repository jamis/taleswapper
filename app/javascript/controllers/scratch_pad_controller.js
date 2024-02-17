import { Controller } from "@hotwired/stimulus"

const throttleWindow = 3000; // 3 seconds

export default class extends Controller {
  static targets = [ "text", "form", "position" ];

  connect() {
    this.setPosition();
    this.textTarget.focus();
    this.textTarget.blur();
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
    this.updatePosition();
    this.formTarget.submit();
  }

  close() {
    let cursorMoved = (this.positionTarget.value != this.textTarget.selectionStart);
    if (this.timeoutPending || cursorMoved) this.saveForm();
    setTimeout(() => this.element.remove(), 0);
  }

  setPosition() {
    let pos = parseInt(this.positionTarget.value) || 0;
    let fullText = this.textTarget.value;
    this.textTarget.value = fullText.substring(0, pos);

    let saveHeight = this.textTarget.clientHeight;
    this.textTarget.style.height = "1px";
    let top = this.textTarget.scrollHeight;
    this.textTarget.style.height = saveHeight + "px";

    this.textTarget.value = fullText;
    let height = this.textTarget.clientHeight;
    let offset = height / 2;

    if (top > offset) {
      this.textTarget.scrollTop = top - height / 2;
    }

    this.textTarget.setSelectionRange(pos, pos);
  }

  updatePosition() {
    this.positionTarget.value = this.textTarget.selectionStart;
  }
}
