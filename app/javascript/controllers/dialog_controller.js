import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = [ "hidden" ];

  static values = {
    state: { type: String, default: "closed" },
    onClose: { type: String, default: "hide" },
    serviceName: String
  }

  static targets = [ "title" ];

  set title(value) {
    this.titleTarget.innerHTML = value;
  }

  connect() {
    if (this.serviceNameValue.length > 0) {
      window.TaleSwapper.Services.register(this.serviceNameValue, this);
    }

    if (this.stateValue == "open")
      this.open();
    else
      this.close();
  }

  disconnect() {
    if (this.serviceNameValue.length > 0) {
      window.TaleSwapper.Services.unregister(this.serviceNameValue);
    }
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

    let autoFocus = this.element.querySelector('[autofocus]');
    autoFocus?.focus();
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
