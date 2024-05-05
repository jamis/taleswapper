class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :chapter

  class <<self
    def organized
      by_chapter = includes(:chapter).group_by(&:chapter)
      by_story = by_chapter.keys.group_by(&:story)

      { chapters_by_story: by_story, bookmarks_by_chapter: by_chapter }
    end
  end
end
