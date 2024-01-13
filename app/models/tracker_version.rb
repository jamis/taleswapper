class TrackerVersion < ApplicationRecord
  belongs_to :tracker
  belongs_to :original, class_name: "TrackerVersion", optional: true

  delegate :name, :template, to: :tracker

  serialize :data, coder: JSON

  def prior(*args)
    template.prior_for(self, *args)
  end

  def value(*args)
    template.value_for(self, *args)
  end

  def element_changed?(*args)
    previous = prior(*args)
    !previous.nil? && previous != value(*args)
  end
end
