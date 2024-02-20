class Story < ApplicationRecord
  belongs_to :creator, class_name: 'User'

  has_many :chapters, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy

  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }
  scope :published, -> { joins(:chapters).where('chapters.published_at <= ?', Time.now).distinct }

  def walk_chapters(restricted: true, &block)
    return unless chapters.starter.any?

    block.call(:open) # open the current list
    chapters.starter.each do |chapter|
      chapter.walk(:linear, restricted: restricted, &block)
    end

    block.call(:close) # close the current list
  end
end
