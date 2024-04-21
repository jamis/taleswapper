import TrackSheetUpdatesRendererController from "./track_sheet_updates_renderer_controller"
import { marked } from "marked";
import DOMPurify from "dompurify";
import Handlebars from "handlebars";

export default class extends TrackSheetUpdatesRendererController {
  static targets = [
    'addCard', 'addValue',
    'updateValue', 'removeValue'
  ];

  registerPartials() {
    super.registerPartials();

    this.handlebars.registerPartial('addCard', this.addCardTarget.innerHTML);
    this.handlebars.registerPartial('addValue', this.addValueTarget.innerHTML);
    this.handlebars.registerPartial('updateValue', this.updateValueTarget.innerHTML);
    this.handlebars.registerPartial('removeValue', this.removeValueTarget.innerHTML);
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
}
