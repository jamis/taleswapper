import { Controller } from "@hotwired/stimulus"
import TrackSheet from "track-sheet"

export default class extends Controller {
  static targets = [ "template" ];

  static values = {
    trackSheet: Object
  };

  connect() {
    this.checkMany();
  }

  addSectionHere(event) {
    let target = event.target;
    let newSection = this.cloneTemplate();

    if (target.nextSibling)
      target.parentNode.insertBefore(newSection, target.nextSibling);
    else
      target.parentNode.appendChild(newSection);

    this.renumberSections();
  }

  get sections() {
    return this.element.querySelectorAll('.section-form:not(.hidden)');
  }

  renumberSections() {
    this.checkMany();

    this.sections.forEach((section, index) => {
      this.renumberSection(section, index + 1);
    });
  }

  renumberSection(section, position) {
    // find all named elements
    let named = section.querySelectorAll("[name]");

    // rewrite the names
    for (let element of named) {
      let name = element.name;

      if (name.match(/^template/))
        name = name.replace(/^template/, `chapter[sections_attributes][${position}]`);
      else
        name = name.replace(/\[sections_attributes\]\[\d+\]/, `[sections_attributes][${position}]`);

      element.name = name;

      if (name.match(/\[position\]/)) element.value = position;
    }
  }

  cloneTemplate() {
    let clone = this.templateTarget.content.cloneNode(true);
    return clone;
  }

  checkMany() {
    if (this.sections.length > 1) {
      this.element.classList.add("many-sections");
    } else {
      this.element.classList.remove("many-sections");
    }
  }

  // Computes the track sheet as of the given section. `targetSection` is a
  // reference to a .section-form div.
  //
  // If `includeTarget` is true, the computed sheet will include the updates
  // from the target section.
  trackSheetFor(targetSection, includeTarget) {
    let sheet = new TrackSheet(this.trackSheetValue);
    for (let section of this.sections) {
      if (section == targetSection && !includeTarget) break;
      this.applyUpdatesTo(sheet, section);
      if (section == targetSection) break;
    }

    return sheet.source;
  }

  applyUpdatesTo(sheet, section) {
    let json = section.querySelector('.track-sheet-update').value;
    if (json.length < 1) return sheet;

    let updates = JSON.parse(json);
    for (let update of updates) {
      sheet.applyUpdate(update);
    }
  }
}
