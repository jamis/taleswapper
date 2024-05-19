import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "form", "deleteButton" ];

  static values = {
    confirm: String,
  };

  submitAsDelete(event) {
    if (window.confirm(this.confirmValue)) {
      this.deleteButtonTarget.click();
      this.formTarget.setAttribute('aria-busy', 'true');
    }
  }
}
