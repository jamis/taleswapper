import TrackSheetUpdatesRendererController from "./track_sheet_updates_renderer_controller"
import { marked } from "marked";
import DOMPurify from "dompurify";
import Handlebars from "handlebars";

export default class extends TrackSheetUpdatesRendererController {
  static targets = [
    'addCard', 'addValue',
    'updateCard', 'updateValue', 'removeValue', 'renameValue'
  ];

  registerPartials() {
    super.registerPartials();

    this.handlebars.registerPartial('addCard', this.addCardTarget.innerHTML);
    this.handlebars.registerPartial('addValue', this.addValueTarget.innerHTML);
    this.handlebars.registerPartial('updateCard', this.updateCardTarget.innerHTML);
    this.handlebars.registerPartial('updateValue', this.updateValueTarget.innerHTML);
    this.handlebars.registerPartial('removeValue', this.removeValueTarget.innerHTML);
    this.handlebars.registerPartial('renameValue', this.renameValueTarget.innerHTML);
  }

  renderTrackSheet(sheet) {
    let elements = this.elementsForGroup(sheet);
    return this.parseHTML(this.containerTemplate({ elements }));
  }

  elementsForGroup(group) {
    let elements = [];

    for (let key in group) {
      let value = group[key];
      if (value._type) {
        const method = `contextFor_add_${value._type}`;
        const context = this[method](key, value);
        elements.push(context);
      } else {
        elements.push({ path: [ key ], elements: this.elementsForGroup(value) });
      }
    }

    return elements;
  }

  contextFor_add_bool(name, prop, update) {
    return this.contextFor_add_value(name, { value: new Handlebars.SafeString(prop.value ? '❌' : '&mdash;') }, update);
  }

  contextFor_add_card(name, prop, update) {
    let value = new Handlebars.SafeString(DOMPurify.sanitize(marked.parse(prop.value)));
    return { partial: 'addCard', data: { name, value } };
  }

  contextFor_add_int(name, prop, update) {
    return this.contextFor_add_value(name, prop, update);
  }

  contextFor_add_string(name, prop, update) {
    return this.contextFor_add_value(name, prop, update);
  }

  contextFor_add_value(name, prop, update) {
    return { partial: 'addValue', data: { name, value: prop.value } };
  }

  contextFor_update_int(name, prop, update) {
    return this.contextFor_update_value(name, prop, update);
  }

  contextFor_update_string(name, prop, update) {
    return this.contextFor_update_value(name, prop, update);
  }

  contextFor_update_card(name, prop, update) {
    let prior = prop.value;
    let value = update.child[name];

    return { partial: 'updateCard', data: { name, prior, value } };
  }

  contextFor_update_value(name, prop, update) {
    let prior = prop.value;
    let value = update.child[name];

    return { partial: 'updateValue', data: { name, prior, value } };
  }

  contextFor_remove(name) {
    return {
      partial: 'removeValue',
      data: { name }
    }
  }

  contextFor_rename(name, update) {
    return {
      partial: 'renameValue',
      data: { oldName: name, newName: update.child[name] }
    }
  }
}
