class Proposal < ApplicationRecord
  belongs_to :chapter

  has_many :proposers
  has_many :users, through: :proposers
end
