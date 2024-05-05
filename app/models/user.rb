class User < ApplicationRecord
  include User::Subscriber

  # Subscribing to a creator will notify subscribers when new stories are
  # first published, but not when updates are made to those stories.
  include Subscribable

  has_secure_password

  encrypts :display_name, deterministic: true
  encrypts :email_address, deterministic: true

  has_many :stories, foreign_key: 'creator_id'
  has_many :tracker_templates, foreign_key: 'creator_id'
  has_many :comments
  has_many :bookmarks, dependent: :destroy

  scope :creators, -> { where(creator: true) }
  scope :confirmed, -> { where.not(confirmed_at: nil) }

  before_create :generate_unique_token

  validates_presence_of :display_name, :email_address
  validates_uniqueness_of :display_name, :email_address

  def admin?
    email_address == Rails.application.config.x.admin_email_address
  end

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
