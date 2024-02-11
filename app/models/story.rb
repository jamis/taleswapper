class Story < ApplicationRecord
  belongs_to :creator, class_name: 'User'

  has_many :chapters, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy

  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }
  scope :published, -> { joins(:chapters).where('chapters.published_at <= ?', Time.now).distinct }

  def walk_chapters(restricted: true, &block)
    return unless chapters.any?

    block.call(:open) # open the current list
    chapters.first.walk(:linear, restricted: restricted, &block)
    block.call(:close) # close the current list
  end
end
