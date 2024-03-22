import { Controller } from "@hotwired/stimulus"
import Drafts from "drafts";

export default class extends Controller {
  static values = {
    uuid: String,
    parent: String
  };

  connect() {
    let drafts = new Drafts().draftsFor(this.parentValue);

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.uuidValue)) {
        localStorage.removeItem(key);
      }
    });

    drafts.unregister(this.uuidValue);
  }
}
