class User < ApplicationRecord
  has_secure_password

  has_many :stories, foreign_key: 'creator_id'
  has_many :tracker_templates, foreign_key: 'creator_id'
  has_many :comments

  scope :creators, -> { where(creator: true) }
end
