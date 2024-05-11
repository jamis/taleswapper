class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :chapter

  class <<self
    def organized
      by_chapter = includes(:chapter).group_by(&:chapter)
      by_story = by_chapter.keys.group_by(&:story)

      by_chapter.keys.each do |chapter|
        list = by_chapter[chapter]

        anchor_positions = Hash[chapter.block_anchors.map.with_index.to_a]
        marks, orphans = list.partition { |mark| anchor_positions.key?(mark.anchor) }
        marks = marks.sort_by { |mark| anchor_positions[mark.anchor] }

        by_chapter[chapter] = { orphans: orphans, marks: marks }
      end

      { chapters_by_story: by_story, bookmarks_by_chapter: by_chapter }
    end
  end
end
