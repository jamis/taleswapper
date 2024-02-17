import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    minHeight: { type: Number, default: 144 }
  };

  connect() {
    this.registerResizeObserver();
    this.resize();
  }

  disconnect() {
    this.unregisterResizeObserver();
  }

  resize() {
    let saved = window.scrollY;

    this.element.style.height = "1px";
    let currentHeight = Math.max(this.minHeightValue, this.element.scrollHeight);
    this.element.style.height = currentHeight + "px";

    window.scroll(window.scrollX, saved);
  }

  registerResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.element.parentElement);
  }

  unregisterResizeObserver() {
    this.resizeObserver.unobserve(this.element.parentElement);
  }
}
