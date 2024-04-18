import { Controller } from "@hotwired/stimulus"
import TrackSheet from 'track-sheet';

export default class extends Controller {
  static values = {
    source: Object
  }

  connect() {
    window.TaleSwapper.Services.register('track-sheet-manager', this);
  }

  disconnect() {
    window.TaleSwapper.Services.unregister('track-sheet-manager');
  }

  trackSheetAt(tag, include = false) {
    let updateTags = this.element.querySelectorAll('ts-tracker-updates');
    let sheet = new TrackSheet(this.sourceValue);

    for (let candidate of updateTags) {
      if (candidate == tag && !include) break;

      let updates = JSON.parse(candidate.dataset.updates);
      sheet.applyUpdates(updates);

      if (candidate == tag) break;
    }

    return sheet;
  }
}
