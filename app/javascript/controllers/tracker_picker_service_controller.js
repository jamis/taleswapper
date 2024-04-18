import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = [ 'dialog', 'tracker-picker' ];

  connect() {
    window.TaleSwapper.Services.register('trackerPicker', this);
  }

  disconnect() {
    window.TaleSwapper.Services.unregister('trackerPicker');
  }

  open(sheet, mode, callback) {
    this.trackerPickerOutlet.prepare(sheet, mode, callback);
    this.dialogOutlet.open();
  }

  close() {
    this.dialogOutlet.close();
  }
}
