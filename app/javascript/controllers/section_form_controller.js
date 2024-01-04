import { Controller } from "@hotwired/stimulus"

const selectedClassNames = "bg-blue-100";
const unselectedClassNames = "text-gray-400";

export default class extends Controller {
  static targets = [
    'role', 'editor', 'destroy',
    'primary', 'secondary',
    'leftSide', 'rightSide'
  ];

  connect() {
    if (this.roleTarget.value == 'primary')
      this.selectPrimary();
    else
      this.selectSecondary();

    this.resizeEditor();
  }

  selectPrimary() {
    this.roleTarget.value = 'primary';

    this.primaryTarget.classList.remove(unselectedClassNames);
    this.secondaryTarget.classList.remove(selectedClassNames);
    this.primaryTarget.classList.add(selectedClassNames);
    this.secondaryTarget.classList.add(unselectedClassNames);

    this.leftSideTarget.classList.add('hidden');
    this.rightSideTarget.classList.remove('hidden');
  }

  selectSecondary() {
    this.roleTarget.value = 'secondary';

    this.secondaryTarget.classList.remove(unselectedClassNames);
    this.primaryTarget.classList.remove(selectedClassNames);
    this.secondaryTarget.classList.add(selectedClassNames);
    this.primaryTarget.classList.add(unselectedClassNames);

    this.rightSideTarget.classList.add('hidden');
    this.leftSideTarget.classList.remove('hidden');
  }

  deleteSection() {
    if (window.confirm('Delete this section?')) {
      this.destroyTarget.value = 1;
      this.element.classList.add('hidden');
    }
  }

  resizeEditor() {
    this.editorTarget.style.height = "1px";

    let currentHeight = Math.max(144, this.editorTarget.scrollHeight);

    this.editorTarget.style.height = currentHeight + "px";
  }
}
