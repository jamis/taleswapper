import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = [ "hidden" ];

  static values = {
    state: { type: String, default: "closed" },
    onClose: { type: String, default: "hide" }
  }

  connect() {
    if (this.stateValue == "open")
      this.open();
    else
      this.close();
  }

  toggle() {
    if (this.stateValue == "open")
      this.close();
    else
      this.open();
  }

  open() {
    this.element.classList.remove(this.hiddenClass);
    this.stateValue = "open";
  }

  close() {
    switch(this.onCloseValue) {
      case "hide":
        this.element.classList.add(this.hiddenClass);
        this.stateValue = "closed";
        break;
      case "remove":
        setTimeout(() => this.element.remove(), 0);
        break;
    }
  }
}
