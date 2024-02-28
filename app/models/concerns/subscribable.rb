module Subscribable
  extend ActiveSupport::Concern

  included do
    has_many :subscriber_subscriptions, class_name: 'Subscription', as: :subscribable, dependent: :destroy
    has_many :subscribers, through: :subscriber_subscriptions, source: :user
  end

  def subscriber_subscribed?(user)
    subscriber_subscriptions.exists?(user: user)
  end
end
