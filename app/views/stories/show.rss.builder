xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title @story.creator.display_name + ': ' + @story.long_title
    xml.description md(@story.description)
    xml.link story_url(@story)

    @story.walk_chapters do |state, chapter|
      next unless state == :start_entry

      xml.item do
        xml.title chapter.title
        xml.pubDate chapter.published_at.to_fs(:rfc822)
        xml.link chapter_url(chapter)
        xml.guid chapter_url(chapter)
      end
    end
  end
end
