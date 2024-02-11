class Chapter < ApplicationRecord
  belongs_to :story

  has_many :sections, dependent: :destroy
  has_many :track_sheet_updates, through: :sections
  has_many :comments, as: :commentable, dependent: :destroy

  has_many :actions, foreign_key: :source_id, dependent: :destroy

  has_one  :prior_action, class_name: 'Action', foreign_key: :target_id, dependent: :destroy
  has_one  :prior_chapter, through: :prior_action, source: :source

  has_one :scratch_pad, dependent: :destroy
  has_one :outline, dependent: :destroy
  has_one :track_sheet, dependent: :destroy

  # a reference to the prequel chapter; used during sequel creation
  attr_accessor :prequel

  # a reference to the uuid of the draft that created this chapter; used during
  # sequel creation
  attr_accessor :uuid

  before_create :setup_records

  accepts_nested_attributes_for :sections, allow_destroy: true
  accepts_nested_attributes_for :outline
  accepts_nested_attributes_for :scratch_pad

  def self.create_sequel(params)
    create!(prequel: params[:prequel],
            uuid: params[:uuid],
            outline_attributes: { contents: params[:contents] },
            scratch_pad_attributes: { contents: params[:scratch_pad] })
  end

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

  def final_track_sheet
    track_sheet.apply(track_sheet_updates.order('sections.position': :asc))
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

  def ensure_at_least_one_section!
    sections.build if sections.empty?
  end

  private

  def setup_records
    setup_prequel
    setup_scratch_pad
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

  # inherit the scratch pad from the prior chapter, if not already
  # present.
  def setup_scratch_pad
    return if scratch_pad.present?
    build_scratch_pad(contents: pending_prior_chapter&.scratch_pad&.contents || '')
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
end
