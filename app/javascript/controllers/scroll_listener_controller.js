import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    header: String
  };

  connect() {
    this._scrollHandler = this.onScroll.bind(this);
    window.addEventListener('scroll', this._scrollHandler);

    let header = document.querySelector(this.headerValue);
    this.headerHeight = header.clientHeight;

    this.handlers = [];
  }

  disconnect() {
    window.removeEventListener('scroll', this._scrollHandler);
  }

  register(listener) {
    this.handlers.push(listener);
  }

  unregister(listener) {
    let idx = this.handlers.indexOf(listener);
    if (idx >= 0) this.handlers.splice(idx, 1);
  }

  onScroll(event) {
    let wtop = window.scrollY;

    for (let handler of this.handlers) {
      let rect = handler.element.getBoundingClientRect();
      let toolbarHeight = handler.toolbarHeight;

      if (rect.bottom <= this.headerHeight) {
        // element is scrolled above the top of the page. It's all
        // hidden and the position of the toolbar no longer matters.
        if (handler.toolbarState != 'released') handler.releaseToolbar();
      } else if (rect.bottom <= this.headerHeight + toolbarHeight) {
        // only the toolbar is visible at this point; it needs to no
        // longer be fixed and should scroll with the page now.
        handler.fixToolbar(this.headerHeight, true);
      } else if (rect.top < this.headerHeight && rect.bottom > this.headerHeight) {
        // element intersects the top of the page. the toolbar needs to be
        // fixed in place at the top of the page.
        if (handler.toolbarState != 'fixed') handler.fixToolbar(this.headerHeight);
      } else {
        // element is after the top of the page (possibly below the fold, still)
        if (handler.toolbarState != 'released') handler.releaseToolbar();
      }
    }
  }
}
