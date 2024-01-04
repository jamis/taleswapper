import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "template" ];

  connect() {
    this.checkMany();
  }

  addSectionBefore(event) {
    let target = this.findTarget(event);
    target.parentNode.insertBefore(this.cloneTemplate(), target);
    this.renumberSections();
  }

  addSectionAfter(event) {
    let target = this.findTarget(event);
    if (target.nextSibling)
      target.parentNode.insertBefore(this.cloneTemplate(), target.nextSibling);
    else
      target.parentNode.appendChild(this.cloneTemplate());
    this.renumberSections();
  }

  get sections() {
    return this.element.querySelectorAll('.section-form:not(.hidden)');
  }

  renumberSections() {
    this.checkMany();

    this.sections.forEach((section, index) => {
      this.renumberSection(section, index);
    });
  }

  renumberSection(section, position) {
    // find all named elements
    let named = section.querySelectorAll("[name]");

    // rewrite the names
    for (let element of named) {
      let name = this.baseNameOf(element);
      let fullName = `chapter[sections_attributes][${position}][${name}]`;
      element.name = fullName;

      if (name == "position") element.value = position;
    }
  }

  baseNameOf(element) {
    let tail = element.name.match(/\[(\w+)\]$/);
    return tail[1];
  }

  findTarget(event) {
    return event.target.closest('.section-form');
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
