class Action < ApplicationRecord
  belongs_to :source, class_name: 'Chapter'
  belongs_to :target, class_name: 'Chapter'

  scope :in_order, -> { order(position: :asc) }
  scope :published, -> { joins(:target).where('chapters.published_at >= ?', Time.now) }

  before_save :set_position

  def prompt
    super || target.title || 'Next chapter'
  end

  private

  def set_position
    return if position > 0

    previous = source.actions.in_order.pluck(:position).last || 0
    self.position = previous + 1
  end
end
