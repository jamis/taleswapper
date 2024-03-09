class Section < ApplicationRecord
  belongs_to :chapter
  has_rich_text :content
  has_one :track_sheet_update, dependent: :destroy

  accepts_nested_attributes_for :track_sheet_update

  before_save :set_position

  scope :in_order, -> { order(position: :asc) }

  # The state of the track sheet immediately before applying any updates
  # from this section.
  def current_track_sheet
    updates = chapter.track_sheet_updates.where('sections.position < ?', position).order('sections.position': :asc)
    chapter.track_sheet.apply(updates)
  end

  def word_count
    content.to_s.scan(/\w+/).count
  end

  private

  def set_position
    return if position > 0

    previous = chapter.sections.in_order.pluck(:position).last || 0
    self.position = previous + 1
  end
end
