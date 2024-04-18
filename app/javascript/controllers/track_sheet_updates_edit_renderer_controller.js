import TrackSheetUpdatesRendererController from "./track_sheet_updates_renderer_controller"

export default class extends TrackSheetUpdatesRendererController {
  static targets = [
    'updateContainer', 'addFrame',
    'addBool', 'addCard', 'addInt', 'addString',
    'updateValue'
  ];

  renderUpdateContainer(title, contents) {
    let container = this.instantiate(this.updateContainerTarget, { title });

    if (contents) {
      let contentElement = container.querySelector('.content');
      contentElement.replaceWith(contents);
    }

    return container;
  }

  renderNewTracker(contents) {
    return this.renderUpdateContainer('NEW TRACKER', contents);
  }

  renderUpdateTracker(contents) {
    return this.renderUpdateContainer('UPDATED TRACKER', contents);
  }

  renderAddFrame(selectedType, contents) {
    let container = this.instantiate(this.addFrameTarget);
    let selectTag = container.querySelector('.content--type');

    if (selectedType) {
      selectTag.querySelector('.content--pick-one').remove();
      selectTag.value = selectedType;
    }

    if (contents) {
      let contentElement = container.querySelector('.content');
      contentElement.replaceWith(contents);
    }

    return container;
  }

  renderUpdate_update_value(name, prop, update, template) {
    let body = this.instantiate(template, { name, prior: prop.value, value: update.child[name] });
    return this.renderUpdateTracker(body);
  }

  renderUpdate_update_int(name, prop, update) {
    return this.renderUpdate_update_value(name, prop, update, this.updateValueTarget);
  }

  renderUpdate_update_string(name, prop, update) {
    return this.renderUpdate_update_value(name, prop, update, this.updateValueTarget);
  }

  renderUpdate_add_value(name, prop, update, template) {
    let body = this.instantiate(template, { name, value: prop.value });
    let frame = this.renderAddFrame(prop._type, body);
    let container = this.renderNewTracker(frame);

    return container;
  }

  renderUpdate_add_int(name, prop, update) {
    return this.renderUpdate_add_value(name, prop, update, this.addIntTarget);
  }

  renderUpdate_add_bool(name, prop, update) {
    return this.renderUpdate_add_value(name, prop, update, this.addBoolTarget);
  }

  renderUpdate_add_card(name, prop, update) {
    return this.renderUpdate_add_value(name, prop, update, this.addCardTarget);
  }

  renderUpdate_add_string(name, prop, update) {
    return this.renderUpdate_add_value(name, prop, update, this.addStringTarget);
  }
}
