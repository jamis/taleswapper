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
  }

  removeEventListeners() {
    this.entriesTarget.removeEventListener(this._onChangeListener);
  }

  addTracker() {
    this.openTrackerPicker('add', (parent) => this.addTrackerAt(parent));
  }

  updateTracker() {
    this.openTrackerPicker('pick', (parent, child, defn) => this.updateTrackerAt(parent, child, defn));
  }

  deleteTracker() {
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
    let sheet = this.sectionsOutlet.trackSheetFor(this.element.closest('.section-form'));
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
    }
  }
}
