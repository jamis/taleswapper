class Chapter < ApplicationRecord
  include Announceable

  belongs_to :story

  has_one :creator, through: :story

  scope :starter, -> { where(start: true) }

  has_many :comments, as: :commentable, dependent: :destroy
  has_many :bookmarks, dependent: :destroy

  has_many :actions, foreign_key: :source_id, dependent: :destroy
  has_many :sequels, through: :actions, source: :target

  has_one  :prior_action, class_name: 'Action', foreign_key: :target_id, dependent: :destroy
  has_one  :prior_chapter, through: :prior_action, source: :source

  # the scratch_pads list will never have more than two entries -- one for story
  # notes, and one for outline. This list is just for convenience is updating and
  # clearing them.
  has_many :scratch_pads, dependent: :destroy

  has_one :story_notes, class_name: 'ScratchPad::StoryNotes'
  has_one :outline, class_name: 'ScratchPad::Outline'

  has_one :track_sheet, dependent: :destroy

  has_rich_text :content
  has_many_attached :images

  # a reference to the prequel chapter; used during sequel creation
  attr_accessor :prequel

  # a reference to the uuid of the draft that created this chapter; used during
  # sequel creation
  attr_accessor :uuid

  before_save :set_default_title
  before_create :possibly_set_start
  before_create :setup_records

  after_save :touch_story
  after_touch :touch_story

  after_update :push_track_sheet_forward
  after_save :refresh_attachments

  accepts_nested_attributes_for :outline
  accepts_nested_attributes_for :story_notes

  def self.create_sequel(params)
    create!(prequel: params[:prequel],
            uuid: params[:uuid],
            outline_attributes: { contents: params[:contents] || '' },
            story_notes_attributes: { contents: params[:story_notes] || '' })
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

  def time_to_read(wpm = 250)
    word_count / wpm.to_f
  end

  def walk(mode, restricted: true, &block)
    return if restricted && !published?

    block.call(:start_entry, self)
    list = restricted ? actions.published : actions

    mode = :branching if list.many?
    block.call(:open) if mode == :branching

    list.each do |action|
      action.target.walk(mode, restricted: restricted, &block)
    end

    block.call(:close) if mode == :branching
    block.call(:end_entry)
  end

  def embedded_images(reload = false)
    @embedded_images = nil if reload
    @embedded_images ||= EmbeddedImages.new(self)
  end

  private

  def possibly_set_start
    return if story.chapters.starter.any?
    self.start = true
  end

  def setup_records
    setup_prequel
    setup_story_notes
    setup_outline
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

  # inherit the story notes from the prior chapter, if not already
  # present.
  def setup_story_notes
    return if story_notes.present?
    build_story_notes(contents: pending_prior_chapter&.story_notes&.contents || '')
  end

  def setup_outline
    return if outline.present?
    build_outline
  end

  # inherit the track sheet from the prior chapter, if not already
  # present.
  def setup_track_sheet
    build_track_sheet(definition: pending_prior_chapter&.final_track_sheet || {})
  end

  def touch_story
    return unless published?

    story.touch
  end

  def push_track_sheet_forward
    return unless sequels.any?
    final = final_track_sheet

    sequels.each do |sequel|
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
end
