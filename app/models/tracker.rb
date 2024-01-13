class Tracker < ApplicationRecord
  belongs_to :story
  belongs_to :template, class_name: "TrackerTemplate"

  has_many :versions, class_name: "TrackerVersion"

  def latest_version
    versions.last
  end
end
