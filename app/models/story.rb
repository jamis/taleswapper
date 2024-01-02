class Story < ApplicationRecord
  belongs_to :creator, class_name: 'User'
  belongs_to :beginning, class_name: 'Chapter', optional: true

  has_many :chapters

  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }
end
