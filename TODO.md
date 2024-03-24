TODO:

* Probably chapter titles ought to be required. Maybe the title could just default to something like "Next chapter" for those who don't want actual titles? (Only, "next chapter" does work for the "flip back to" link...)
* Restriction: You cannot publish a chapter if the previous chapter is not published. You cannot unpublish a chapter if any sequel chapter is published.
* Notifications
    - when comments are posted
    - when someone subscribes to you or one of your stories
    - when a new chapter is published
    - when a new story is published
    - when you are mentioned in a comment (??)
* Allow a reader to view the track sheet at top of chapter and after each update.
* Admin interface for manually adjusting data:
  - converting a user to a creator
  - editing any field of any table
  - moderating comments
* User profile page (show, edit, update, delete)

* Memory is an issue, surprisingly. (R14 errors in Heroku logs.)
* Reordering sections
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
* Resizable dialog boxes? Or maybe just make them generally larger?
* Creators need to be able to moderate comments on their own content.
  - creators could specify how they want moderation done: no moderation, or require moderation (no comments shown that aren't approved).
* Actually persist autosaves to the database, as well as to local storage.
* Need to make stories archivable (perhaps via stories/edit?)
* New/edit story needs to have a toggle for "interactive" (to allow comments on the story).
* Tests????
