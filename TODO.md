TODO:

* Refactor track sheet rendering (reuse client-side rendering for this?)
* difference in update format in edit vs display mode is unfortunate. Would be nice to make it more WYSIWYG
* rename tracker
* clear all trackers (also, should this be an "X" button, instead of the word "clear"?)
* button for removing an image (communicates intention better than expecting a user to backspace over it).
* test images with the s3 service

* Bookmark feature (suggested by Eyes). Set a bookmark, attach an optional note to it.
* It would be nice to be able to set up a bunch of trackers before the story starts, and make them available for the reader to look at in a side-channel somewhere.
* Reset password feature
* paragraphs following an <hr> should not be indented.
* Tracker picker should allow searching for a tracker by typing its name
* Could there be some way to "bulk publish" multiple chapters simultaneously?
* Notifications
    - include "unsubscribe" option in every message, too
* I want a way to call out a tracker -- an Ironsworn asset, for example, or my current momentum. I think we need a fourth option, besides add/update/delete. "Show" would be nice. (Could just use "update", and the display side of things doesn't show a prior value if prior == given)
* Admin interface for manually adjusting data:
  - converting a user to a creator
  - editing any field of any table
  - moderating comments

* Editor
  - support sans-serif and monotype font selection
  - markdown-style shortcuts for certain things? (e.g. --- for mdash, etc)
* Banner image for (1) stories, and (2) chapters.
* Autosave for chapters#edit
* Improve the "update card" display, using a diff algorithm to show what text has been added/removed. (perhaps https://github.com/deadusr/html-diff-ts)
* Reordering sections
* Allow a reader to view the track sheet at top of chapter and after each update.
* In chapter/edit, see the current state of the track sheet at each section.
* Formatting issue: lines can break BEFORE an emdash, which looks weird. Need to figure out how to avoid that, and only let lines break AFTER an emdash.
* "new sequel" view might offer an optional full-screen view, perhaps with notes and trackers as side-bars, always open?
* Resizable dialog boxes? Or maybe just make them generally larger?
* Creators need to be able to moderate comments on their own content.
  - creators could specify how they want moderation done: no moderation, or require moderation (no comments shown that aren't approved).
* Actually persist autosaves to the database, as well as to local storage.
* Some way to group a set of chapters.
* Option for a story or chapter to be downloaded (as PDF?) to be read offline. (Creator-level option)
  - How would this work for non-linear stories? (choose-your-own-adventure style?)
* Better front page. Perhaps cards for each creator? What will the page look like with hundreds of creators? Oh, we could show the top 10 (or whatever) creators with most-recently-updated stories!
