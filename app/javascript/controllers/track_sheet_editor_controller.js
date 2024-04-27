// This is an ad-hoc controller, not a stimulus one.

export default class {
  constructor(parent) {
    this.parent = parent;
    this.addEventListeners();
  }

  disconnect() {
    this.removeEventListeners();
  }

  get root() {
    return this.parent.shadow;
  }

  addEventListeners() {
    this._onChangeListener = this.onChange.bind(this);
    this.root.addEventListener("change", this._onChangeListener);

    this._onInputListener = this.onInput.bind(this);
    this.root.addEventListener("input", this._onInputListener);

    this._onBlurListener = this.onBlur.bind(this);
    this.root.addEventListener("blur", this._onBlurListener, true);

    this._onClickListener = this.onClick.bind(this);
    this.root.addEventListener("click", this._onClickListener);

    this._onKeyDownListener = this.onKeyDown.bind(this);
    this.root.addEventListener("keydown", this._onKeyDownListener);

    this._onPasteListener = this.onPaste.bind(this);
    this.root.addEventListener("paste", this._onPasteListener);
  }

  removeEventListeners() {
    this.root.removeEventListener("change", this._onChangeListener);
    this.root.removeEventListener("input", this._onInputListener);
    this.root.removeEventListener("blur", this._onBlurListener);
    this.root.removeEventListener("click", this._onClickListener);
    this.root.removeEventListener("keydown", this._onKeyDownListener);
    this.root.removeEventListener("paste", this._onPasteListener);
  }

  addTracker() {
    this.openTrackerPicker('add', (path) => this.addTrackerAt(path));
  }

  updateTracker() {
    this.openTrackerPicker('pick', (path, child, defn) => this.updateTrackerAt(path, child, defn));
  }

  renameTracker() {
    this.openTrackerPicker('pick-any', (path, child, defn) => this.renameTrackerAt(path, child, defn));
  }

  deleteTracker() {
    this.openTrackerPicker('pick-any', (path, child, defn) => this.deleteTrackerAt(path, child, defn));
  }

  clearTrackers() {
    if (this.parent.updates.length > 0) {
      if (!confirm("Really clear all of these tracker updates?"))
        return;
    }

    this.parent.remove();
  }

  saveUpdates() {
    console.log('IMPLEMENT: trackSheetEditor.saveUpdates()');
  }

  getRenderer(callback) {
    return this.parent.getRenderer(callback);
  }

  openTrackerPicker(mode, callback) {
    this.parent.withTrackSheet(sheet => {
      this.openPicker(sheet, mode, callback);
    }, true);
  }

  getTrackerPicker() {
    return window.TaleSwapper.Services.lookup('trackerPicker');
  }

  openPicker(sheet, mode, callback) {
    this.getTrackerPicker().then(picker => picker.open(sheet.source, mode, callback));
  }

  closePicker() {
    this.getTrackerPicker().then(picker => picker.close());
  }

  getUpdatesContainerFor(parent, renderer) {
    // does the given parent already have a frame present?
    // if not, create one.
    let pattern = CSS.escape(JSON.stringify(parent));
    let frame = this.root.querySelector(`[data-path="${pattern}"]`);

    if (!frame) {
      frame = renderer.renderPathFrame(parent);
      this.root.querySelector('.paths').appendChild(frame);
    }

    return frame.querySelector('.updates');
  }

  addTrackerAt(parent) {
    this.closePicker();

    this.getRenderer(renderer => {
      let container = this.getUpdatesContainerFor(parent, renderer);
      container.appendChild(renderer.renderNewAdd());
    });
  }

  updateTrackerAt(parent, child, defn) {
    this.closePicker();

    this.getRenderer(renderer => {
      let container = this.getUpdatesContainerFor(parent, renderer);
      container.appendChild(renderer.renderNewUpdate(parent, child, defn));
    });
  }

  renameTrackerAt(parent, child, defn) {
    this.closePicker();
    this.getRenderer(renderer => {
      // determine if we're renaming an actual tracker, or a tracker group
      let realChild = child ? child : parent.pop();
      let realDefn = defn ? defn : { _type: 'group' };

      let container = this.getUpdatesContainerFor(parent, renderer);
      container.appendChild(renderer.renderNewRename(parent, realChild, realDefn));
    });
  }

  deleteTrackerAt(parent, child, defn) {
    this.closePicker();

    this.getRenderer(renderer => {
      // determine if we're deleting an actual tracker, or a tracker group
      let realChild = child ? child : parent.pop();
      let realDefn = defn ? defn : { _type: 'group' };

      let container = this.getUpdatesContainerFor(parent, renderer);
      let element = renderer.renderNewDelete(parent, realChild, realDefn);
      container.appendChild(element);

      this.applyChangeToUpdate(element);
    });
  }

  onChange(event) {
    if (event.target.classList.contains('ts-type-select')) {
      let select = event.target;
      let type = select.value;
      let content = select.closest('.ts-frame').querySelector('.content');
      this.getRenderer(renderer => {
        let typeBody = renderer.renderNewAddType(type);
        content.replaceWith(typeBody);

        let pickOne = select.querySelector('option[value=""]');
        if (pickOne) pickOne.remove();
      });
    }
  }

  onInput(event) {
    if (event.target.isContentEditable) {
      event.target.dataset.dirty = true;

      // account for issue where selecting all the next in a field
      // and deleting it results in the field being vertically offset
      // weirdly.
      if (event.target.textContent.length == 0)
        event.target.innerHTML = "<br>";
    }
  }

  onBlur(event) {
    if (event.target.dataset.dirty) {
      delete event.target.dataset.dirty;
      this.applyChangeToUpdate(event.target);
    }
  }

  onClick(event) {
    if (event.target.classList.contains('command--delete')) {
      event.preventDefault();
      this.tryRemoveEntryWithLink(event.target);
    } else if (event.target.id == 'newTracker') {
      event.preventDefault();
      this.addTracker();
    } else if (event.target.id == 'updateTracker') {
      event.preventDefault();
      this.updateTracker();
    } else if (event.target.id == 'renameTracker') {
      event.preventDefault();
      this.renameTracker();
    } else if (event.target.id == 'removeTracker') {
      event.preventDefault();
      this.deleteTracker();
    } else if (event.target.id == 'clearTrackers') {
      event.preventDefault();
      this.clearTrackers();
    } else if (event.target.classList.contains('ts-add-tracker-here')) {
      event.preventDefault();
      this.addTrackerHere(event.target);
    } else if (event.target.type == 'checkbox') {
      this.applyChangeToUpdate(event.target);
    }
  }

  onKeyDown(event) {
    if (event.key === 'Enter' && event.target.tagName === 'SPAN') {
      event.preventDefault();
    }
  }

  onPaste(event) {
    if (event.target.isContentEditable) {
      event.preventDefault();
      const content = event.clipboardData.getData('text');
      let sanitized = content.replaceAll("\n", ' ');
      let range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(sanitized));
    }
  }

  tryRemoveEntryWithLink(linkElement) {
    let frame = linkElement.closest('.ts-frame');

    if (!frame) return;
    if (!confirm('Do you really want to delete this entry?')) return;

    let parent = frame.closest('[data-path]');
    let updates = parent.querySelector('.updates');
    if (updates.children.length <= 1) {
      parent.remove();
    } else {
      frame.remove();
    }

    this.compileUpdates();
  }

  addTrackerHere(target) {
    let parent = JSON.parse(target.closest('[data-parent]').dataset.parent);
    this.addTrackerAt(parent);
  }

  applyChangeToUpdate(target) {
    // 1. get the path from the path frame (look for closest with [data-path])
    let parent = JSON.parse(target.closest('[data-path]').dataset.path);
    let frame = target.closest('.ts-frame');

    // 2. look for closest with [data-action].
    let action = target.closest('[data-action]').dataset.action;

    // 3. get name from .ts-name
    let name = frame.querySelector('.ts-name').innerText.trim();

    // 4. Look for '.ts-value'
    let value = undefined;
    let valueElement = frame.querySelector('.ts-value');

    if (valueElement) {
      if (valueElement.type == 'checkbox')
        value = valueElement.checked;
      else
        value = valueElement.innerText.trim();
    }

    // 5. Compile the update and set 'data-update' on the frame.
    let child;
    switch(action) {
      case 'add':
        let type = target.closest('[data-type]').dataset.type;
        child = { [ name ]: { _type: type, value } }
        break;
      case 'update':
      case 'rename':
        child = { [ name ]: value }
        break;
      case 'remove':
        child = [ name ];
        break;
    }

    let update = { action, parent, child };
    frame.dataset.update = JSON.stringify(update);

    // 6. Compile all updates from frames and save to the hidden field
    this.compileUpdates();
  }

  compileUpdates() {
    let elements = Array.from(this.root.querySelectorAll('[data-update]'));
    let updates = elements.map(item => JSON.parse(item.dataset.update));
    this.parent.saveUpdates(updates);
  }
}
