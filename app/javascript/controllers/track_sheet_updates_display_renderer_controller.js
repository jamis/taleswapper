import TrackSheetUpdatesRendererController from "./track_sheet_updates_renderer_controller"
import { marked } from "marked";
import DOMPurify from "dompurify";

export default class extends TrackSheetUpdatesRendererController {
  static targets = [
    'addCard', 'addValue',
    'updateValue'
  ];

  renderUpdate_add_bool(name, prop, update) {
    return this.renderUpdate_add_value(name, { value: prop.value ? '❌' : '&mdash;' }, update);
  }

  renderUpdate_add_card(name, prop, update) {
    let value = DOMPurify.sanitize(marked.parse(prop.value));
    return this.instantiate(this.addCardTarget, { name, value });
  }

  renderUpdate_add_int(name, prop, update) {
    return this.renderUpdate_add_value(name, prop, update);
  }

  renderUpdate_add_string(name, prop, update) {
    return this.renderUpdate_add_value(name, prop, update);
  }

  renderUpdate_add_value(name, prop, update) {
    return this.instantiate(this.addValueTarget, { name, value: prop.value });
  }

  renderUpdate_update_int(name, prop, update) {
    return this.renderUpdate_update_value(name, prop, update);
  }

  renderUpdate_update_string(name, prop, update) {
    return this.renderUpdate_update_value(name, prop, update);
  }

  renderUpdate_update_value(name, prop, update) {
    let prior = prop.value;
    let value = update.child[name];

    return this.instantiate(this.updateValueTarget, { name, prior, value });
  }
}
