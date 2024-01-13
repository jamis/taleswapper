class TrackerInstance < ApplicationRecord
  belongs_to :section
  belongs_to :tracker_version
end
