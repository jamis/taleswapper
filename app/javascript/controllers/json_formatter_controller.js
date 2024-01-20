import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    let parsed = JSON.parse(this.element.value);
    let pretty = JSON.stringify(parsed, undefined, 2);
    this.element.value = pretty;
  }
}
