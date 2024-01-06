class TrackerVersion < ApplicationRecord
  belongs_to :tracker
  belongs_to :original, class_name: "TrackerVersion"

  serialize :data, coder: JSON, type: Hash, default: {}
end
