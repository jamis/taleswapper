export default class TrackerUpdatesTag extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const updates = this.getAttribute('data-updates');
    console.log('connected!', updates);

    const shadow = this.attachShadow({ mode: "open" });
    const wrapper = document.createElement('div');
    wrapper.style.border = "1px solid red";
    wrapper.style.borderRadius = "5px";
    wrapper.style.backgroundColor = "rgb(255,225,225)";
    wrapper.style.width = "100%";
    wrapper.style.height = "4rem";

    shadow.appendChild(wrapper);
  }
}
