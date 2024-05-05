import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "form", "deleteButton" ];

  submitAsDelete(event) {
    if (window.confirm("Really delete this bookmark?")) {
      this.deleteButtonTarget.click();
      this.formTarget.setAttribute('aria-busy', 'true');
    }
  }
}
