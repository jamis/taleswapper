import { Controller } from "@hotwired/stimulus"
import interact from "interactjs"

function getHashFromURL(url) {
  const index = url.indexOf('#');
  if (!index) return '';

  return url.substring(index);
}

const dragOpacity = 'opacity-70';

export default class extends Controller {
  static targets = [
    "bookmark", "bookmarkForm",
    "bookmarkAnchor", "bookmarkDescription", "bookmarkName"
  ];

  static values = {
    addBookmarkService: String,
    bookmarks: Array,
    bookmarkImagePath: String,
  };

  connect() {
    this.bookmarksValue.forEach(this.renderMark.bind(this));

    if (this.hasBookmarkTarget) {
      interact(this.bookmarkTarget).draggable({
        onstart: this.bookmarkDragStart.bind(this),
        onmove: this.bookmarkDragMove.bind(this),
        onend: this.bookmarkDragEnd.bind(this),
      }).styleCursor(false);

      interact('.prose--traditional [id]').dropzone({
        ondrop: this.bookmarkDrop.bind(this),
      });
    }
  }

  checkLocationHash(event) {
    const hash = getHashFromURL(event.newURL || event.currentTarget?.URL);
    if (hash.length < 1) return;

    const anchor = hash.substring(1);
    const prefix = "bookmark_";
    if (!anchor.startsWith(prefix)) return;

    const id = anchor.substring(prefix.length);
    const target = this.element.querySelector('#' + id);
    if (!target) return;

    const top = target.getBoundingClientRect().top;
    window.scrollTo({ top: top - 60, behavior: 'smooth' });
  }

  renderMark(mark) {
    let anchor = this.element.querySelector('#' + mark.anchor);
    if (anchor) {
      let element = document.createElement('a');
      element.setAttribute('href', mark.url);
      element.setAttribute('class', 'bookmark');
      element.dataset.turboStream = true;
      element.innerHTML = `<img src="${this.bookmarkImagePathValue}" class="w-full h-full" />`;
      anchor.append(element);
    }
  }

  considerBookmarkClick(event) {
    if (this.bookmarkWasMoved) {
      event.preventDefault();
    }

    delete this.bookmarkWasMoved;
  }

  bookmarkDragStart(event) {
    this.draggingBookmark = true;
    this.bookmarkWasMoved = false;

    this.bookmarkGhost = event.target.cloneNode(true);

    delete this.bookmarkGhost.dataset.chapterPresenterTarget;
    event.target.parentNode.append(this.bookmarkGhost);

    this.bookmarkTarget.classList.add(dragOpacity);

    this.dragPosition = { x: 0, y: 0 };
  }

  bookmarkDragMove(event) {
    this.bookmarkWasMoved = true;

    this.dragPosition.x += event.dx;
    this.dragPosition.y += event.dy;

    this.bookmarkTarget.style.transform = `translate(${this.dragPosition.x}px, ${this.dragPosition.y}px)`;
    this.bookmarkTarget.style.cursor = 'move';
    this.bookmarkTarget.disabled = true;

    if (event.dragLeave) {
      this.elementToBookmark.classList.remove('bookmark-target');
      delete this.elementToBookmark;
    }

    if (event.dragEnter) {
      this.elementToBookmark = event.dragEnter;
      this.elementToBookmark.classList.add('bookmark-target');
    }
  }

  bookmarkDragEnd(event) {
    this.draggingBookmark = false;
    this.bookmarkGhost.remove();

    this.bookmarkTarget.style.transform = 'translate(0px, 0px)';
    this.bookmarkTarget.style.cursor = '';
    this.bookmarkTarget.classList.remove(dragOpacity);

    if (this.elementToBookmark) {
      this.elementToBookmark.classList.remove('bookmark-target');
    }
  }

  bookmarkDrop(event) {
    if (event.target === this.elementToBookmark) {
      if (this.elementToBookmark.querySelector('.bookmark')) {
        // there's already a bookmark for the current user here...
        return;
      }

      this.bookmarkFormTarget.reset();
      this.bookmarkDescriptionTarget.value = this.elementToBookmark.textContent;
      this.bookmarkAnchorTarget.value = this.elementToBookmark.id;

      this.withAddBookmarkDialog(dialog => {
        dialog.open();
        this.bookmarkNameTarget.focus();
      });
    }
  }

  bookmarkSubmitted(event) {
  }

  bookmarkFinished(event) {
    this.withAddBookmarkDialog(dialog => dialog.close());
  }

  withAddBookmarkDialog(callback) {
    window.TaleSwapper.Services.lookup(this.addBookmarkServiceValue).then(callback);
  }
}
