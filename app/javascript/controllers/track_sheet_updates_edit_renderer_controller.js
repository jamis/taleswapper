import { capitalize } from '../utilities';
import TrackSheetUpdatesRendererController from "./track_sheet_updates_renderer_controller"

const newTrackerTitle = 'NEW TRACKER';
const updateTrackerTitle = 'UPDATE TRACKER';
const removeTrackerTitle = 'REMOVE TRACKER';

export default class extends TrackSheetUpdatesRendererController {
  static targets = [
    'updateContainer', 'addFrame',
    'addBool', 'addCard', 'addInt', 'addString',
    'updateBool', 'updateCard', 'updateValue',
    'removeValue'
  ];

  registerPartials() {
    super.registerPartials();

    this.updateContainerTemplate = this.handlebars.compile('{{> updateContainer}}');
    this.typeTemplate = this.handlebars.compile('{{> (lookup . "partial") data}}');

    this.handlebars.registerPartial('updateContainer', this.updateContainerTarget.innerHTML);
    this.handlebars.registerPartial('addFrame', this.addFrameTarget.innerHTML);
    this.handlebars.registerPartial('addBool', this.addBoolTarget.innerHTML);
    this.handlebars.registerPartial('addCard', this.addCardTarget.innerHTML);
    this.handlebars.registerPartial('addInt', this.addIntTarget.innerHTML);
    this.handlebars.registerPartial('addString', this.addStringTarget.innerHTML);
    this.handlebars.registerPartial('updateBool', this.updateBoolTarget.innerHTML);
    this.handlebars.registerPartial('updateCard', this.updateCardTarget.innerHTML);
    this.handlebars.registerPartial('updateValue', this.updateValueTarget.innerHTML);
    this.handlebars.registerPartial('removeValue', this.removeValueTarget.innerHTML);

    this.handlebars.registerHelper('json', function(object) {
      return JSON.stringify(object);
    });
  }

  renderNewAdd() {
    let context = this.contextFor_add_value();
    return this.parseHTML(this.updateContainerTemplate(context));
  }

  renderNewAddType(type) {
    let message = `contextFor_add_${type}`;

    if (this.isMissing(message))
      return this.renderMissing(message);
    else {
      let data = this[message](undefined, {});
      let context = { partial: `add${capitalize(type)}`, data };
      return this.parseHTML(this.typeTemplate(context));
    }
  }

  renderNewUpdate(parent, name, prop) {
    let message = `contextFor_update_${prop._type}`;

    if (this.isMissing(message))
      return this.renderMissing(message, name);
    else {
      let context = this[message](name, prop, { action: 'update', parent, child: { [name]: prop.value } });
      return this.parseHTML(this.updateContainerTemplate(context));
    }
  }

  renderNewDelete(parent, name, prop) {
    let message = 'contextFor_remove';

    if (this.isMissing(message))
      return this.renderMissing(message, name);
    else {
      let context = this[message](name, prop, { action: 'remove', parent, child: [ name ] });
      return this.parseHTML(this.updateContainerTemplate(context));
    }
  }

  contextFor_update_value(name, prop, update) {
    return {
      title: updateTrackerTitle,
      partial: 'updateValue',
      action: 'update',
      update,
      data: { name, prior: prop.value, value: update.child[name] }
    };
  }

  contextFor_update_bool(name, prop, update) {
    return {
      title: updateTrackerTitle,
      partial: 'updateBool',
      action: 'update',
      update,
      data: { name, prior: prop.value, value: update.child[name] }
    };
  }

  contextFor_update_card(name, prop, update) {
    return {
      title: updateTrackerTitle,
      partial: 'updateCard',
      action: 'update',
      update,
      data: { name, prior: prop.value, value: update.child[name] }
    };
  }

  contextFor_update_int(name, prop, update) {
    return this.contextFor_update_value(name, prop, update);
  }

  contextFor_update_string(name, prop, update) {
    return this.contextFor_update_value(name, prop, update);
  }

  contextFor_add_value(name, prop, template) {
    return {
      title: newTrackerTitle,
      partial: 'addFrame',
      action: 'add',
      data: {
        partial: template,
        isBool: prop?._type === 'bool',
        isInt: prop?._type === 'int',
        isString: prop?._type === 'string',
        isCard: prop?._type === 'card',
        isNew: !prop?._type,
        name,
        value: prop?.value
      }
    };
  }

  contextFor_add_int(name, prop) {
    return this.contextFor_add_value(name, prop, 'addInt');
  }

  contextFor_add_bool(name, prop) {
    return this.contextFor_add_value(name, prop, 'addBool');
  }

  contextFor_add_card(name, prop) {
    return this.contextFor_add_value(name, prop, 'addCard');
  }

  contextFor_add_string(name, prop) {
    return this.contextFor_add_value(name, prop, 'addString');
  }

  contextFor_remove_int(name, prop, update) {
    return this.contextFor_remove_value(name, prop, update);
  }

  contextFor_remove_bool(name, prop, update) {
    return this.contextFor_remove_value(name, prop, update);
  }

  contextFor_remove_card(name, prop, update) {
    return this.contextFor_remove_value(name, prop, update);
  }

  contextFor_remove_group(name, prop, update) {
    return this.contextFor_remove_value(name, prop, update);
  }

  contextFor_remove_string(name, prop, update) {
    return this.contextFor_remove_value(name, prop, update);
  }

  contextFor_remove(name, update) {
    return {
      title: removeTrackerTitle,
      partial: 'removeValue',
      action: 'remove',
      update,
      data: { name }
    };
  }
}
