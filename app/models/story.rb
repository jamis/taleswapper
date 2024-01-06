class Story < ApplicationRecord
  belongs_to :creator, class_name: 'User'

  has_one :scratch_pad
  has_many :chapters
  has_many :trackers

  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }
  scope :published, -> { joins(:chapters).where('chapters.published_at <= ?', Time.now).distinct }

  after_create { create_scratch_pad! }

  def walk_chapters(&block)
    return unless chapters.any?

    block.call(:open) # open the current list
    chapters.first.walk(:linear, &block)
    block.call(:close) # close the current list
  end
end
