module Subscribable
  extend ActiveSupport::Concern

  included do
    has_many :subscriber_subscriptions, class_name: 'Subscription', as: :subscribable, dependent: :destroy
    has_many :subscribers, through: :subscriber_subscriptions, source: :user
  end

  def subscriber_count
    subscriber_subscriptions.count
  end

  def subscriber_subscribed?(user)
    subscriber_subscriptions.exists?(user: user)
  end

  def subscription_for(user)
    subscriber_subscriptions.find_by(user_id: user.id)
  end
end
