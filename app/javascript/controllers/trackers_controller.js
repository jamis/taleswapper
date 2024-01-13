import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [];

  connect() {
  }

  close() {
    setTimeout(() => this.element.remove(), 0);
  }
}
