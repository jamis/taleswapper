class TrackSheet < ApplicationRecord
  belongs_to :chapter

  serialize :definition, coder: JSON

  def apply(updates)
    Marshal.load(Marshal.dump(definition || {})).tap do |copy|
      updates.each { |update| update.apply_to(copy) }
    end
  end
end
