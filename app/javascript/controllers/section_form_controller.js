import { Controller } from "@hotwired/stimulus"

const selectedClassNames = "bg-blue-100";
const unselectedClassNames = "text-gray-400";

export default class extends Controller {
  static targets = [
    'role', 'editor', 'destroy',
    'primary', 'aside',
    'leftSide', 'rightSide'
  ];

  connect() {
    switch(this.roleTarget.value) {
      case 'primary': this.selectPrimary(); break;
      case 'aside': this.selectAside(); break;
    }
  }

  selectPrimary() {
    this.roleTarget.value = 'primary';

    this.selectButton(this.primaryTarget);

    this.leftSideTarget.classList.add('hidden');
    this.rightSideTarget.classList.remove('hidden');
  }

  selectAside() {
    this.roleTarget.value = 'aside';

    this.selectButton(this.asideTarget);

    this.rightSideTarget.classList.add('hidden');
    this.leftSideTarget.classList.remove('hidden');
  }

  deleteSection() {
    if (window.confirm('Delete this section?')) {
      this.destroyTarget.value = 1;
      this.element.classList.add('hidden');
    }
  }

  selectButton(selected) {
    [ this.primaryTarget, this.asideTarget ].forEach((button) => {
      if (button == selected) {
        button.classList.remove(unselectedClassNames);
        button.classList.add(selectedClassNames);
      } else {
        button.classList.remove(selectedClassNames);
        button.classList.add(unselectedClassNames);
      }
    });
  }
}
