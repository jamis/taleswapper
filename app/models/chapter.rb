class Chapter < ApplicationRecord
  BOOKMARKABLE_BLOCKS = %w[ p li h1 h2 h3 h4 h5 h6 div ]
  BOOKMARKABLE_BLOCKS_SELECTOR = BOOKMARKABLE_BLOCKS.join(',')

  WRAPPABLE_BLOCKS = %w[ ts-image ts-tracker-updates ]
  WRAPPABLE_BLOCKS_SELECTOR = WRAPPABLE_BLOCKS.join(',')

  include Announceable

  belongs_to :story

  has_one :creator, through: :story

  scope :setup, -> { where(role: 'setup') }
  scope :starter, -> { where(role: 'start') }

  has_many :comments, as: :commentable, dependent: :destroy
  has_many :bookmarks, dependent: :destroy

  has_many :actions, foreign_key: :source_id, dependent: :destroy
  has_many :sequels, through: :actions, source: :target

  has_one  :prior_action, class_name: 'Action', foreign_key: :target_id, dependent: :destroy
  has_one  :prior_chapter, through: :prior_action, source: :source

  has_one :track_sheet, dependent: :destroy

  has_rich_text :content
  has_many_attached :images
  has_one_attached :banner

  # a reference to the prequel chapter; used during sequel creation
  attr_accessor :prequel_id

  before_save :set_default_title
  before_create :setup_records
  before_save :process_blocks

  after_save :touch_story
  after_touch :touch_story

  after_update :push_track_sheet_forward
  after_save :refresh_attachments

  class <<self
    def attachments
      ActiveStorage::Attachment.where(record: all)
    end
  end

  # The chapter that this chapter should look to for it's initial track sheet
  def track_sheet_origin
    if role == 'start'
      story.setup_chapter
    else
      pending_prior_chapter
    end
  end

  def prequel
    return nil unless prequel_id

    @prequel ||= story.chapters.find(prequel_id)
  end

  # TODO: Note that this does not fully implement "scheduled" publishing of
  # a chapter. We still need a way for the story itself to reflect that
  # it was updated at the moment the chapter (eventually) becomes
  # published...
  def published?(now: Time.now)
    published_at && published_at <= now
  end
  alias published published?

  def published=(published)
    published = case published
                when "0", 0, "false", false, "no" then false
                else true
                end

    self.published_at = published ? (published_at || Time.now) : nil
  end

  def publish!
    update!(published: true)
  end

  def revoke!
    update!(published: false)
  end

  def notify!
    return if announced?

    announce!
    story.subscribers.each do |subscriber|
      NotificationsMailer.with(subscriber: subscriber, chapter: self).new_chapter.deliver_later
    end
  end

  # A chapter cannot be published if the chapter before it has not yet
  # been published.
  def publishable?
    !published? && (prior_chapter.nil? || prior_chapter.published?)
  end

  # A chapter cannot be revoked ("unpublished") if any chapter after it
  # is published.
  def revokable?
    published? && !sequels.any?(&:published?)
  end

  def final_track_sheet
    track_sheet.apply(track_sheet_updates)
  end

  def track_sheet_updates
    content.
      body.
      fragment.
      find_all('ts-tracker-updates').
      flat_map { |el| JSON.parse(el['data-updates'] || '[]') }
  end

  def word_count
    # FIXME: make this smart enough to ignore HTML tags, and attributes
    # on HTML tags.
    content.to_s.scan(/\w+/).count
  end

  def block_anchors
    content.to_s.scan(/\bid="(.*?)"/).map(&:first)
  end

  def time_to_read(wpm = 250)
    word_count / wpm.to_f
  end

  def walk(mode, restricted: true, &block)
    return if restricted && !published?

    block.call(:start_entry, self)
    list = restricted ? actions.published : actions

    if list.empty?
      block.call(:terminal, self) unless restricted
    else
      mode = :branching if list.many?
      block.call(:open) if mode == :branching

      list.each do |action|
        action.target.walk(mode, restricted: restricted, &block)
      end

      block.call(:close) if mode == :branching
    end

    block.call(:end_entry)
  end

  def embedded_images(reload = false)
    @embedded_images = nil if reload
    @embedded_images ||= EmbeddedImages.new(self)
  end

  private

  def setup_records
    setup_prequel
    setup_track_sheet
  end

  def pending_prior_chapter
    prior_action&.source
  end

  # build the prior action that points to this new chapter
  def setup_prequel
    return if prior_action.present? || !prequel.present?
    build_prior_action(source: prequel)
  end

  # inherit the track sheet from the prior chapter, if not already
  # present.
  def setup_track_sheet
    build_track_sheet(definition: track_sheet_origin&.final_track_sheet || {})
  end

  def touch_story
    return unless published?

    story.touch
  end

  def push_track_sheet_forward
    next_chapters = (role == 'setup') ? [ *story.start_chapter ] : sequels
    return unless next_chapters.any?

    final = final_track_sheet

    next_chapters.each do |sequel|
      if sequel.track_sheet.definition != final
        sequel.track_sheet.update definition: final
        sequel.save!
      end
    end
  end

  def set_default_title
    if title.blank?
      self.title = 'Untitled'
    end
  end

  def refresh_attachments
    return unless content.body

    prior = images_blob_ids
    current = embedded_images.blob_ids

    prior_only = prior - current
    if prior_only.any?
      # anything in prior and not in current is removable
      ActiveStorage::Attachment.where(blob_id: prior_only).destroy_all
    end

    current_only = current - prior
    # anything in current and not in prior must be added
    current_only.each do |blob_id|
      ActiveStorage::Attachment.create!(name: 'images', record: self, blob_id: blob_id);
    end
  end

  def process_blocks
    return unless content.body

    fragment = content.body.fragment.replace(WRAPPABLE_BLOCKS_SELECTOR) do |node|
      if node.parent.name != 'div'
        node.wrap('<div></div>')
      else
        node
      end
    end

    count = 0
    now = Time.now.to_i

    fragment = fragment.replace(BOOKMARKABLE_BLOCKS_SELECTOR) do |node|
      if node['id']
        node
      else
        count += 1
        node.tap { |n| n['id'] = "#{n.name.underscore}_#{now}_#{count}" }
      end
    end

    self.content = fragment.to_html if count > 0
  end
end
