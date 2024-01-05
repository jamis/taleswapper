class Story < ApplicationRecord
  belongs_to :creator, class_name: 'User'
  belongs_to :setup, class_name: 'Chapter', optional: true
  belongs_to :beginning, class_name: 'Chapter', optional: true

  has_many :chapters

  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }
  scope :published, -> { joins(:chapters).where('chapters.published_at <= ?', Time.now).distinct }

  def setup_title
    setup && (setup.title.presence || '"session zero"')
  end

  def beginning_title
    beginning && (beginning.title.presence || "the beginning")
  end
end
