TODO:

* When banner has credit text, we don't need as much margin between banner and chapter title.
* When a banner hasn't loaded yet, maybe show a background color (and possibly a loading message)?
* Datestamp on chapters doesn't need day of the week
  - could be just a relative date, but then clicking it reveals the precise date
* When selecting an image, allow to choose between a new file, and any of the images that already exist in any chapter of the user's stories.
* It would be nice to be able to set up a bunch of trackers before the story starts, and make them available for the reader to look at in a side-channel somewhere.
  - in general, I should rethink the "new chapter" flow
* Need a way to get to the user profile page on mobile (currently hidden on small screens)
* Reset password feature
* Tracker picker should allow searching for a tracker by typing its name
* Could there be some way to "bulk publish" multiple chapters simultaneously?
* Notifications
    - include "unsubscribe" option in every message, too
* I want a way to call out a tracker -- an Ironsworn asset, for example, or my current momentum. I think we need a fourth option, besides add/update/delete. "Show" would be nice. (Could just use "update", and the display side of things doesn't show a prior value if prior == given)
    - would be neat to have an inline option, perhaps <ts-tracker-inline> or something? Clicking on it could bring up a track sheet dialog with that tracker highlighted.
    - for inline tag, cards might just show their title...
* Admin interface for manually adjusting data:
  - converting a user to a creator
  - editing any field of any table
  - moderating comments

* Editor
  - support sans-serif and monotype font selection
  - markdown-style shortcuts for certain things? (e.g. --- for mdash, etc)
* Autosave for chapters#edit
* Improve the "update card" display, using a diff algorithm to show what text has been added/removed. (perhaps https://github.com/deadusr/html-diff-ts)
* Allow a reader to view the track sheet at top of chapter and after each update.
* In chapter/edit, see the current state of the track sheet at each tracker update.
* "new sequel" view might offer an optional full-screen view, perhaps with notes and trackers as side-bars, always open?
* Creators need to be able to moderate comments on their own content.
  - creators could specify how they want moderation done: no moderation, or require moderation (no comments shown that aren't approved).
* Actually persist autosaves to the database, as well as to local storage.
* Some way to group a set of chapters.
* Option for a story or chapter to be downloaded (as PDF?) to be read offline. (Creator-level option)
  - How would this work for non-linear stories? (choose-your-own-adventure style?)
* Better front page. Perhaps cards for each creator? What will the page look like with hundreds of creators? Oh, we could show the top 10 (or whatever) creators with most-recently-updated stories!
