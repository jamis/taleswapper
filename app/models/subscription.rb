class Subscription < ApplicationRecord
  belongs_to :user
  belongs_to :subscribable, polymorphic: true

  class <<self
    def message_verifier
      Rails.application.message_verifier(:subscription)
    end
  end
end
