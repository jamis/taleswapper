import { Controller } from "@hotwired/stimulus"
import { constructKeyFrom } from 'utilities'

export default class extends Controller {
  static targets = [ 'source', 'entries' ];

  static outlets = [ 'dialog', 'sections', 'tracker-picker' ];

  static values = {
    renderer: String
  }

  connect() {
    try {
      this.updates = JSON.parse(this.sourceTarget.value);
    } catch (error) {
      this.updates = [];
    }

    this.renderUpdates();
    this.addEventListeners();
  }

  disconnect() {
    this.removeEventListeners();
  }

  addEventListeners() {
    this._onChangeListener = (event) => this.onChange(event);
    this.entriesTarget.addEventListener("change", this._onChangeListener);

    this._onInputListener = (event) => this.onInput(event);
    this.entriesTarget.addEventListener("input", this._onInputListener);

    this._onBlurListener = (event) => this.onBlur(event);
    this.entriesTarget.addEventListener("blur", this._onBlurListener, true);

    this._onClickListener = (event) => this.onClick(event);
    this.entriesTarget.addEventListener("click", this._onClickListener);
  }

  removeEventListeners() {
    this.entriesTarget.removeEventListener("change", this._onChangeListener);
    this.entriesTarget.removeEventListener("input", this._onInputListener);
    this.entriesTarget.removeEventListener("blur", this._onBlurListener);
    this.entriesTarget.removeEventListener("click", this._onClickListener);
  }

  addTracker() {
    this.openTrackerPicker('add', (parent) => this.addTrackerAt(parent));
  }

  updateTracker() {
    this.openTrackerPicker('pick', (parent, child, defn) => this.updateTrackerAt(parent, child, defn));
  }

  deleteTracker() {
    window.alert('NOT IMPLEMENTED YET');
    return;
    this.openTrackerPicker('pick', (parent, child) => this.deleteTrackerAt(parent, child));
  }

  saveUpdates() {
    this.sourceTarget.value = JSON.stringify(this.updates);
  }

  getRenderer() {
    return window.TaleSwapper.Services.lookup(this.rendererValue);
  }

  renderUpdates() {
    let sheet = this.sectionsOutlet.trackSheetFor(this.element.closest('.section-form'));
    this.getRenderer().then(renderer => {
      renderer.render(this.updates, sheet, this.entriesTarget);
    });
  }

  openTrackerPicker(mode, callback) {
    let sheet = this.sectionsOutlet.trackSheetFor(this.element.closest('.section-form'), true);
    this.trackerPickerOutlet.prepare(sheet, mode, callback);
    this.dialogOutlet.open();
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
    this.dialogOutlet.close();

    this.getRenderer().then(renderer => {
      let container = this.getUpdatesContainerFor(parent, renderer);
      renderer.renderItem('add', undefined, container);
    });
  }

  updateTrackerAt(parent, child, defn) {
    this.dialogOutlet.close();

    this.getRenderer().then(renderer => {
      let container = this.getUpdatesContainerFor(parent, renderer);
      renderer.renderItem('update', { name: child, value: defn.value, defn }, container);
    });
  }

  deleteTrackerAt(parent, child) {
    this.dialogOutlet.close();

    // next, need to prompt for:
    //    confirmation
    console.log('delete at', parent, child);
  }

  onChange(event) {
    if (event.target.classList.contains('ts-type')) {
      let type = event.target.value;
      let body = event.target.closest('.ts-frame').querySelector('.ts-body');
      body.innerHTML = '';
      this.getRenderer().then(renderer => {
        renderer[`renderItem_add_${type}`]({}, body);
      });
    } else if (event.target.type == 'checkbox') {
      this.applyChangeToUpdate(event.target);
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
    event.preventDefault();

    if (event.target.classList.contains('ts-cancel')) {
      this.tryRemoveEntryWithLink(event.target);
    } else if (event.target.classList.contains('ts-add-tracker-here')) {
      this.addTrackerHere(event.target);
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
    let name = frame.querySelector('.ts-name').innerText;

    // 4. Look for '.ts-value'
    let value = frame.querySelector('.ts-value')?.innerText;
    //   a. If present, set value, and action is 'update' if not already set.
    //   b. Otherwise, action is 'delete'.
    action ||= value ? 'update' : 'delete';

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
