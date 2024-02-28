module SubscriptionsHelper
  def subscribing_allowed?(subscriber, subscribable)
    return false unless subscriber&.confirmed?

    case subscribable
    when Story then subscribable.creator != subscriber
    when User then subscribable != subscriber
    else raise ArgumentError, "unrecognized subscribable #{subscribable.inspect}"
    end
  end

  def subscription_form_for(subscriber, subscribable, **options)
    subscription = subscriber.subscription_for(subscribable)

    url = if subscription
            subscription_path(subscription)
          else
            user_subscriptions_path(Current.user)
          end

    method = subscription ? :delete : :post
    object = subscription ? nil : subscriber.subscriptions.build(subscribable: subscribable)

    form_with(url: url, model: object, method: method, **options) do |f|
      yield f
    end
  end
end
