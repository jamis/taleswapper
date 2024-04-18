// This is an ad-hoc controller, not a stimulus one.

import { constructKeyFrom, dig } from 'utilities'

export default class {
  constructor(parent) {
    this.parent = parent;
    this.addEventListeners();
  }

  disconnect() {
    this.removeEventListeners();
  }

  get root() {
    return this.parent.shadow;
  }

  addEventListeners() {
    this._onChangeListener = (event) => this.onChange(event);
    this.root.addEventListener("change", this._onChangeListener);

    this._onInputListener = (event) => this.onInput(event);
    this.root.addEventListener("input", this._onInputListener);

    this._onBlurListener = (event) => this.onBlur(event);
    this.root.addEventListener("blur", this._onBlurListener, true);

    this._onClickListener = (event) => this.onClick(event);
    this.root.addEventListener("click", this._onClickListener);
  }

  removeEventListeners() {
    this.root.removeEventListener("change", this._onChangeListener);
    this.root.removeEventListener("input", this._onInputListener);
    this.root.removeEventListener("blur", this._onBlurListener);
    this.root.removeEventListener("click", this._onClickListener);
  }

  addTracker() {
    this.openTrackerPicker('add', (path) => this.addTrackerAt(path));
  }

  updateTracker() {
    this.openTrackerPicker('pick', (path, child, defn) => this.updateTrackerAt(path, child, defn));
  }

  deleteTracker() {
    this.openTrackerPicker('pick-any', (path, child, defn) => this.deleteTrackerAt(path, child, defn));
  }

  saveUpdates() {
    console.log('IMPLEMENT: trackSheetEditor.saveUpdates()');
  }

  getRenderer() {
    return this.parent.getRenderer();
  }

  openTrackerPicker(mode, callback) {
    this.parent.withTrackSheet(sheet => {
      this.openPicker(sheet, mode, callback);
    }, true);
  }

  getTrackerPicker() {
    return window.TaleSwapper.Services.lookup('trackerPicker');
  }

  openPicker(sheet, mode, callback) {
    this.getTrackerPicker().then(picker => picker.open(sheet, mode, callback));
  }

  closePicker() {
    this.getTrackerPicker().then(picker => picker.close());
  }

  getRenderer() {
    return window.TaleSwapper.Services.lookup(this.rendererValue);
  }

  getUpdatesContainerFor(parent, renderer) {
    // does the given parent already have a frame present?
    // if not, create one.
    let parentKey = constructKeyFrom(parent);
    let frame = this.entriesTarget.querySelector(`[data-parent-key="${parentKey}"]`);

    if (!frame) {
      frame = renderer.renderPathFrame(parent, parentKey, this.entriesTarget);
    }

    return frame.querySelector('.ts-updates');
  }

  addTrackerAt(parent) {
    this.closePicker();

    this.getRenderer().then(renderer => {
      let container = this.getUpdatesContainerFor(parent, renderer);
      renderer.renderItem('add', undefined, container);
    });
  }

  updateTrackerAt(parent, child, defn) {
    this.closePicker();

    this.getRenderer().then(renderer => {
      let container = this.getUpdatesContainerFor(parent, renderer);
      renderer.renderItem('update', { name: child, value: defn.value, defn }, container);
    });
  }

  deleteTrackerAt(parent, child, defn) {
    this.closePicker();

    this.getRenderer().then(renderer => {
      let realChild = child ? child : parent.pop();
      let realDefn = defn ? defn : { _type: 'group' };
      let container = this.getUpdatesContainerFor(parent, renderer);
      let item = renderer.renderItem('remove', { name: realChild, value: realDefn.value, defn: realDefn }, container);
      this.applyChangeToUpdate(item);
    });
  }

  onChange(event) {
    if (event.target.classList.contains('ts-type')) {
      let type = event.target.value;
      let body = event.target.closest('.ts-frame').querySelector('.ts-body');
      body.innerHTML = '';
      this.getRenderer().then(renderer => {
        renderer[`renderItem_add_${type}`]({}, body);
      });
    }
  }

  onInput(event) {
    if (event.target.isContentEditable) {
      event.target.dataset.dirty = true;
    }
  }

  onBlur(event) {
    if (event.target.dataset.dirty) {
      delete event.target.dataset.dirty;
      this.applyChangeToUpdate(event.target);
    }
  }

  onClick(event) {
    if (event.target.classList.contains('command--delete')) {
      event.preventDefault();
      this.tryRemoveEntryWithLink(event.target);
    } else if (event.target.id == 'newTracker') {
      event.preventDefault();
      this.addTracker();
    } else if (event.target.classList.contains('ts-add-tracker-here')) {
      event.preventDefault();
      this.addTrackerHere(event.target);
    } else if (event.target.type == 'checkbox') {
      this.applyChangeToUpdate(event.target);
    }
  }

  tryRemoveEntryWithLink(linkElement) {
    let frame = linkElement.closest('.ts-frame');

    if (!frame) return;
    if (!confirm('Do you really want to delete this entry?')) return;

    let parent = frame.closest('[data-parent]');
    let updates = parent.querySelector('.ts-updates');
    if (updates.children.length <= 1) {
      parent.remove();
    } else {
      frame.remove();
    }

    this.compileUpdates();
  }

  addTrackerHere(target) {
    let parent = JSON.parse(target.closest('[data-parent]').dataset.parent);
    this.addTrackerAt(parent);
  }

  applyChangeToUpdate(target) {
    // 1. get the path from the path frame (look for closest with [data-parent])
    let parent = JSON.parse(target.closest('[data-parent]').dataset.parent);
    let frame = target.closest('.ts-frame');

    // 2. look for closest with [data-type].
    //   a. If present, set type, and note action is 'add'
    //   b. Otherwise, action is either 'update' or 'delete'.
    let type = target.closest('[data-type]')?.dataset?.type;
    let action = type ? 'add' : null;

    // 3. get name from .ts-name
    let name = frame.querySelector('.ts-name').innerText.trim();

    // 4. Look for '.ts-value'
    let value = undefined;
    let valueElement = frame.querySelector('.ts-value');

    if (valueElement) {
      if (valueElement.type == 'checkbox')
        value = valueElement.checked;
      else
        value = valueElement.innerText.trim();
    }

    //   a. If present, set value, and action is 'update' if not already set.
    //   b. Otherwise, action is 'delete'.
    action ||= (value != undefined) ? 'update' : 'remove';

    // 5. Compile the update and set 'data-update' on the frame.
    let child;
    switch(action) {
      case 'add':
        child = { [ name ]: { _type: type, value } }
        break;
      case 'update':
        child = { [ name ]: value }
        break;
      case 'remove':
        child = [ name ];
        break;
    }

    let update = { action, parent, child };
    frame.dataset.update = JSON.stringify(update);

    // 6. Compile all updates from frames and save to the hidden field
    this.compileUpdates();
  }

  compileUpdates() {
    let elements = Array.from(this.element.querySelectorAll('[data-update]'));
    this.updates = elements.map(item => JSON.parse(item.dataset.update));
    this.saveUpdates();
  }
}
