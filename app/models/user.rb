class User < ApplicationRecord
  has_secure_password

  has_many :stories, foreign_key: 'creator_id'

  scope :creators, -> { where(creator: true) }
end
