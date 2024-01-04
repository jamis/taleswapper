class Chapter < ApplicationRecord
  belongs_to :story

  has_many :sections
  has_many :actions, foreign_key: :source_id

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
end
