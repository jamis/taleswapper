import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    window.TaleSwapper.Services.register('renderer', this);
  }

  disconnect() {
    window.TaleSwapper.Services.unregister('renderer');
  }
}
