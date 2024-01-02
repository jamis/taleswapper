class Action < ApplicationRecord
  belongs_to :source, class_name: 'Chapter'
  belongs_to :target, class_name: 'Chapter'
  belongs_to :proposal, optional: true
end
