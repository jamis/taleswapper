import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "template" ];

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
}
