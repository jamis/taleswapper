TODO:

* Quill editor & ActionText
  - support sans-serif and monotype font selection
  - make center and right alignment work outside the editor
  - markdown-style shortcuts for certain things? (e.g. --- for mdash, etc)
* Media (images, audio, video?). Maybe treat it like the tracker updates, with each section having optional media that are displayed below the section? Or a dedicated section type?
  - quill.js allows attaching images directly by using data URLs, which is pretty clever. It doesn't allow thumbnailing or preprocessing or anything, but I have to admit it's a neat solution. Is it good enough? Probably not, sadly. We need:
      - image captions (optional)
      - attribution
      - alt text
      - querying metadata (dimensions, others?)
      - resizing?
* Banner image for (1) stories, and (2) chapters.
* Figure out how to make the app more resilient in the face of typos in the track sheet updates. (It hurts to lose your work because you typed an attribute name wrong, or forgot a brace.)
* Autosave for chapters#edit
* Notifications
    - when comments are posted
    - when someone subscribes to you or one of your stories
    - when a new chapter is published
    - when a new story is published
* Resizable dialog boxes? Or maybe just make them generally larger?
* Allow a reader to view the track sheet at top of chapter and after each update.
* Consolidate consecutive sections of the same type, for display?
* Creators need to be able to moderate comments on their own content.
* Admin interface for manually adjusting data:
  - converting a user to a creator
  - editing any field of any table
  - moderating comments
* User profile page (show, edit, update, delete)
* Make sure comments and subscriptions are only available to confirmed users
* Actually persist autosaves to the database, as well as to local storage.
* Hide/disable the "track sheet" link (in chapter edit) for early chapters when no track sheet has yet been defined.
