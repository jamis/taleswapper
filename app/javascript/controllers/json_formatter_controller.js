import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    if (this.element.value.length > 0) {
      let parsed = JSON.parse(this.element.value);
      let pretty = JSON.stringify(parsed, undefined, 2);
      this.element.value = pretty;
    }
  }
}
