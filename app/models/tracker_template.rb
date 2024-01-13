class TrackerTemplate < ApplicationRecord
  belongs_to :creator, class_name: "User"

  serialize :definition, coder: JSON
end
