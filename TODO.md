TODO:

* Quill editor & ActionText
  - support/insert custom tags (ts-roll)
    https://codepen.io/javan/pen/oQpevW
  - markdown-style shortcuts for certain things? (e.g. --- for mdash, etc)
* Closing the story notes and chapter outline on chapter edit causes a page refresh, instead of just closing the dialog.
* Media (images, audio, video?). Maybe treat it like the tracker updates, with each section having optional media that are displayed below the section? Or a dedicated section type?
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
