import { Controller } from "@hotwired/stimulus"

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

  // Computes the track sheet as of the given section (not including the
  // updates for that section). `targetSection` is a reference to a
  // .section-form div.
  trackSheetFor(targetSection) {
    let sheet = structuredClone(this.trackSheetValue);
    for (let section of this.sections) {
      if (section == targetSection) break;
      sheet = this.applyUpdatesTo(sheet, section);
    }

    return sheet;
  }

  applyUpdatesTo(sheet, section) {
    let json = section.querySelector('.track-sheet-update').value;
    if (json.length < 1) return sheet;

    let updates = JSON.parse(json);
    for (let update of updates) {
      sheet = this.applyUpdateTo(sheet, update);
    }

    return sheet;
  }

  applyUpdateTo(sheet, update) {
    if (update.action == 'add')
      return this.applyAddUpdateTo(sheet, update);
    if (update.action == 'update')
      return this.applyUpdateUpdateTo(sheet, update);
    if (update.action == 'remove')
      return this.applyRemoveUpdateTo(sheet, update);

    throw `not an acceptable update action: '${update.action}'`;
  }

  findParent(sheet, path) {
    let node = sheet;

    for (let name of path) {
      node[name] ||= {};
      node = node[name];
    }

    return node;
  }

  applyAddUpdateTo(sheet, update) {
    let node = this.findParent(sheet, update.parent);
    Object.assign(node, update.child);
    return sheet;
  }

  applyUpdateUpdateTo(sheet, update) {
    let node = this.findParent(sheet, update.parent);
    for (let prop in update.child) {
      node[prop].value = update.child[prop];
    }
    return sheet;
  }

  applyRemoveUpdateTo(sheet, update) {
    let node = this.findParent(sheet, update.parent);
    for (let child of update.child) {
      delete node[child];
    }
    return sheet;
  }
}
