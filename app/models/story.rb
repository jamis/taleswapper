class Story < ApplicationRecord
  include Subscribable

  belongs_to :creator, class_name: 'User'

  has_many :chapters, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy

  scope :alive, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }
  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }
  scope :published, -> { joins(:chapters).where('chapters.published_at <= ?', Time.now).distinct }

  def archived?(now: Time.now)
    archived_at && archived_at <= now
  end
  alias archived archived?

  def archived=(archived)
    archived = case archived
                when "0", 0, "false", false, "no" then false
                else true
                end

    self.archived_at = archived ? (archived_at || Time.now) : nil
  end

  def soft_delete!(now: Time.now)
    update!(deleted_at: now)
  end

  def undelete!
    update!(deleted_at: nil)
  end

  def deleted?
    deleted_at.present?
  end

  def creator_address
    creator.email_address
  end

  def walk_chapters(restricted: true, &block)
    return unless chapters.starter.any?

    block.call(:open) # open the current list
    chapters.starter.each do |chapter|
      chapter.walk(:linear, restricted: restricted, &block)
    end

    block.call(:close) # close the current list
  end
end
