module User::Subscriber
  extend ActiveSupport::Concern

  included do
    has_many :subscriptions, dependent: :destroy
  end

  def subscribed?(subscribable)
    subscriptions.exists?(subscribable: subscribable)
  end

  def subscribe_to(subscribable)
    subscriptions.create!(subscribable: subscribable)
  end

  def subscription_for(subscribable)
    subscriptions.find_by(subscribable: subscribable)
  end
end
