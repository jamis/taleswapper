import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 'actuator', 'panel' ];

  static values = {
    altLabel: String,
    active: Boolean
  };

  static classes = [ 'hidden' ];

  connect() {
    this.originalLabelValue = this.actuatorTarget.innerHTML;

    if (this.activeValue)
      this.makeActive();
    else
      this.makeInactive();
  }

  toggleActive() {
    if (this.activeValue)
      this.makeInactive();
    else
      this.makeActive();
  }

  makeInactive() {
    this.activeValue = false;
    this.actuatorTarget.innerHTML = this.originalLabelValue;
    this.panelTargets.forEach((panel) => {
      panel.classList.add(this.hiddenClass);
    });
  }

  makeActive() {
    this.activeValue = true;
    this.actuatorTarget.innerHTML = this.altLabelValue;
    this.panelTargets.forEach((panel) => {
      panel.classList.remove(this.hiddenClass);
    });
  }
}
