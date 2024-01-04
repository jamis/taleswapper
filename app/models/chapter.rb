class Chapter < ApplicationRecord
  belongs_to :story

  has_many :sections
  has_many :actions, foreign_key: :source_id

  accepts_nested_attributes_for :sections

  def published?(now: Time.now)
    published_at && published_at <= now
  end
end
