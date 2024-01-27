class Chapter < ApplicationRecord
  belongs_to :story

  has_many :sections
  has_many :track_sheet_updates, through: :sections

  has_many :actions, foreign_key: :source_id

  has_one  :prior_action, class_name: 'Action', foreign_key: :target_id
  has_one  :prior_chapter, through: :prior_action, source: :source

  has_one :scratch_pad
  has_one :track_sheet

  after_create do
    create_scratch_pad! unless scratch_pad
    create_track_sheet! unless track_sheet
  end

  accepts_nested_attributes_for :sections, allow_destroy: true

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

  def add_sequel(chapter:, action:)
    transaction do
      chapter = chapter.merge(
                  scratch_pad: ScratchPad.new(contents: scratch_pad.contents),
                  track_sheet: TrackSheet.new(definition: final_track_sheet))

      story.chapters.create!(chapter).tap do |chapter_record|
        action_record = actions.create(action.merge(target: chapter_record))
      end
    end
  end

  def final_track_sheet
    track_sheet.apply(track_sheet_updates.order('sections.position': :asc))
  end

  def walk(mode, &block)
    block.call(:start_entry, self)

    mode = :branching if actions.many?
    block.call(:open) if mode == :branching

    actions.each do |action|
      action.target.walk(mode, &block)
    end

    block.call(:close) if mode == :branching
    block.call(:end_entry)
  end
end
