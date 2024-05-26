class Story < ApplicationRecord
  include Announceable
  include Subscribable

  belongs_to :creator, class_name: 'User'

  has_many :chapters, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy

  has_one :setup_chapter, -> { where(role: 'setup') }, class_name: 'Chapter'
  has_one :start_chapter, -> { where(role: 'start') }, class_name: 'Chapter'

  has_one_attached :banner

  scope :alive, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }
  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }
  scope :published, -> { joins(:chapters).where('chapters.published_at <= ?', Time.now).distinct }

  class <<self
    # Return a list of all ActiveStorage::Attachments related to the stories in
    # the current scope.
    def attachments
      ActiveStorage::Attachment.where(record: all).or(ActiveStorage::Attachment.where(record: Chapter.where(story: all)))
    end
  end

  # Return a list of all ActiveStorage::Attachments related to this story.
  def attachments
    ActiveStorage::Attachment.where(record: self).or(ActiveStorage::Attachment.where(record: chapters))
  end

  def long_title
    if subtitle.present?
      "#{title} (#{subtitle})"
    else
      title
    end
  end

  def published_at
    setup_chapter&.published_at || start_chapter&.published_at
  end

  def published?
    setup_chapter&.published? || start_chapter&.published?
  end

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

  def notify!
    return if announced?

    announce!
    creator.subscribers.each do |subscriber|
      NotificationsMailer.with(subscriber: subscriber, story: self).new_story.deliver_later
    end
  end

  def walk_chapters(restricted: true, &block)
    return unless start_chapter

    block.call(:open) # open the current list
    start_chapter.walk(:linear, restricted: restricted, &block)
    block.call(:close) # close the current list
  end
end
