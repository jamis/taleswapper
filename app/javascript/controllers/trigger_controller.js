import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = [ "dialog" ];

  do() {
    this.dialogOutlets.forEach(dialog => dialog.toggle());
  }
}
