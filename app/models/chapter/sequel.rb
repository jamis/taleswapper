class Chapter::Sequel
  include ActiveModel::API

  attr_accessor :uuid
  attr_accessor :contents
  attr_accessor :story_notes

  def self.from_chapter(chapter, uuid = nil)
    new(uuid: uuid, contents: '', story_notes: chapter.story_notes.contents)
  end

  def self.from_scratch(uuid = nil)
    new(uuid: uuid, contents: '', story_notes: '')
  end
end
