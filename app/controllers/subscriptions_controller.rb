class SubscriptionsController < ApplicationController
  before_action :require_authentication
  before_action :find_subscription
  before_action :find_subscriber

  def create
    @user.subscriptions.create!(subscription_params)
    redirect_back_or_to root_url, notice: "You're now subscribed!"
  end

  def destroy
    @subscription.destroy
    redirect_back_or_to root_url, notice: "You've been unsubscribed."
  end

  private

  def find_subscription
    @subscription = Subscription.find(params[:id]) if params[:id]
  end

  def find_subscriber
    if params[:user_id]
      @user = User.find(params[:user_id])
      redirect_back_or_to :root if @user != Current.user
    end
  end

  def subscription_params
    params.require(:subscription).permit(:subscribable_type, :subscribable_id)
  end
end
