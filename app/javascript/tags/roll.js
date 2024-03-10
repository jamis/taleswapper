export default class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    setTimeout(() => this.render(), 0);
  }

  render() {
    this.shadowRoot.innerHTML = '';
    const span = document.createElement('SPAN');
    span.style = "white-space: nowrap;";
    span.innerHTML = `🎲${this.innerHTML}`;
    this.shadowRoot.appendChild(span);
  }
}
