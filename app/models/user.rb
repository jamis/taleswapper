class User < ApplicationRecord
  has_secure_password

  has_many :stories, foreign_key: 'creator_id'
  has_many :tracker_templates, foreign_key: 'creator_id'
  has_many :comments

  scope :creators, -> { where(creator: true) }
  scope :confirmed, -> { where.not(confirmed_at: nil) }

  before_create :generate_unique_token

  def confirmed?
    confirmed_at.present?
  end

  def confirm!(at: Time.now)
    update confirmed_at: at
  end

  private

  def generate_unique_token
    loop do
      self.token ||= SecureRandom.uuid
      break unless User.exists?(token: self.token)
    end
  end
end
