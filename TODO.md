TODO:

* Show how long ago a chapter was published
* I want a way to call out a tracker -- an Ironsworn asset, for example, or my current momentum. I think we need a fourth option, besides add/update/delete. "Show" would be nice.
* Need a way to push a change from a previous chapter's tracksheet, forward... Sometimes things need to be retconned.
* A tracker formatted at the same level as a namespace needs spacing fixed (in the track sheet)
* Formatting issue: lines can break BEFORE an emdash, which looks weird. Need to figure out how to avoid that, and only let lines break AFTER an emdash.
* Hide/disable the "track sheet" link (in chapter edit) for early chapters when no track sheet has yet been defined.
* "new sequel" view might offer an optional full-screen view, perhaps with notes and trackers as side-bars, always open?
* Quill editor & ActionText
  - support sans-serif and monotype font selection
  - make center and right alignment work outside the editor
  - markdown-style shortcuts for certain things? (e.g. --- for mdash, etc)
  - keep toolbar at top of screen for long sections
* Media (images, audio, video?). Maybe treat it like the tracker updates, with each section having optional media that are displayed below the section? Or a dedicated section type?
  - quill.js allows attaching images directly by using data URLs, which is pretty clever. It doesn't allow thumbnailing or preprocessing or anything, but I have to admit it's a neat solution. Is it good enough? Probably not, sadly. We need:
      - image captions (optional)
      - attribution
      - alt text
      - querying metadata (dimensions, others?)
      - resizing?
* Banner image for (1) stories, and (2) chapters.
* Autosave for chapters#edit
* Notifications
    - when comments are posted
    - when someone subscribes to you or one of your stories
    - when a new chapter is published
    - when a new story is published
    - when you are mentioned in a comment (??)
* Resizable dialog boxes? Or maybe just make them generally larger?
* Allow a reader to view the track sheet at top of chapter and after each update.
* Creators need to be able to moderate comments on their own content.
  - creators could specify how they want moderation done: no moderation, or require moderation (no comments shown that aren't approved).
* Admin interface for manually adjusting data:
  - converting a user to a creator
  - editing any field of any table
  - moderating comments
* User profile page (show, edit, update, delete)
* Make sure comments and subscriptions are only available to confirmed users (they might be--just need to make sure)
* Actually persist autosaves to the database, as well as to local storage.
* Need to make stories archivable (perhaps via stories/edit?)
* Tests????
