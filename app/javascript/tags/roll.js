export default class extends HTMLElement {
  connectedCallback() {
    this.value = this.getAttribute('value');
    this.render();
  }

  render() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = "<span style='white-space: nowrap;'>🎲" + this.value + "</span>";
  }
}
