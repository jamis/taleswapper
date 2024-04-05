xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title @creator.display_name + ': New Stories'
    xml.description md(@creator.description)
    xml.link creator_url(@creator)

    @creator.stories.alive.active.published.each do |story|
      xml.item do
        xml.title story.title
        xml.pubDate story.published_at.to_fs(:rfc822)
        xml.link story_url(story)
        xml.guid story_url(story)
      end
    end
  end
end
