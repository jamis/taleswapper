import { Controller } from "@hotwired/stimulus"
import Drafts from "drafts";

export default class extends Controller {
  static targets = [ "list", "template" ];

  static values = {
    key: String
  };

  connect() {
    let drafts = new Drafts().draftsFor(this.keyValue);
    if (drafts.list.length > 0) {
      this.listTarget.innerHTML = '';

      let fmt = new Intl.DateTimeFormat(navigator.language,
          { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
            hour: 'numeric', minute: 'numeric' });

      for (let draft of drafts.list) {
        let stamp = drafts.timestampFor(draft);
        let date = new Date();
        date.setTime(stamp);

        let li = this.cloneTemplate();
        let link = li.querySelector('a');
        link.innerHTML = fmt.format(date);
        link.href = `${link.href}?uuid=${draft}`;
        this.listTarget.appendChild(li);
      }

      this.element.classList.remove('hidden');
    } else {
      this.element.classList.add('hidden');
    }
  }

  cloneTemplate() {
    let clone = this.templateTarget.content.cloneNode(true);
    return clone;
  }
}
