class Chapter < ApplicationRecord
  belongs_to :story

  has_many :sections
  has_many :actions, foreign_key: :source_id
end
