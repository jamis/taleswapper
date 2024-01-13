import { Controller } from "@hotwired/stimulus"

const selectedClassNames = "bg-blue-100";
const unselectedClassNames = "text-gray-400";

export default class extends Controller {
  static targets = [
    'role', 'editor', 'destroy',
    'left', 'right', 'full',
    'leftSide', 'rightSide'
  ];

  connect() {
    switch(this.roleTarget.value) {
      case 'left': this.selectLeft(); break;
      case 'right': this.selectRight(); break;
      case 'full': this.selectFull(); break;
    }
  }

  selectLeft() {
    this.roleTarget.value = 'left';

    this.selectButton(this.leftTarget);

    this.leftSideTarget.classList.add('hidden');
    this.rightSideTarget.classList.remove('hidden');

    this.resizeEditor();
  }

  selectRight() {
    this.roleTarget.value = 'right';

    this.selectButton(this.rightTarget);

    this.rightSideTarget.classList.add('hidden');
    this.leftSideTarget.classList.remove('hidden');

    this.resizeEditor();
  }

  selectFull() {
    this.roleTarget.value = 'full';

    this.selectButton(this.fullTarget);

    this.rightSideTarget.classList.add('hidden');
    this.leftSideTarget.classList.add('hidden');
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

  selectButton(selected) {
    [ this.leftTarget, this.rightTarget, this.fullTarget ].forEach((button) => {
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
