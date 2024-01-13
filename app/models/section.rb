class Section < ApplicationRecord
  belongs_to :chapter
  has_many :tracker_instances
  has_many :tracker_versions, through: :tracker_instances

  accepts_nested_attributes_for :tracker_versions, allow_destroy: true

  before_save :set_position

  scope :in_order, -> { order(position: :asc) }

  private

  def set_position
    return if position > 0

    previous = chapter.sections.in_order.pluck(:position).last || 0
    self.position = previous + 1
  end
end
