class Chapter::Sequel
  include ActiveModel::API

  attr_accessor :uuid
  attr_accessor :contents
  attr_accessor :scratch_pad

  def self.from_chapter(chapter, uuid = nil)
    new(uuid: uuid, contents: '', scratch_pad: chapter.scratch_pad.contents)
  end

  def self.from_scratch(uuid = nil)
    new(uuid: uuid, contents: '', scratch_pad: '')
  end
end
