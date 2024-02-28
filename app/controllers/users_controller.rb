class UsersController < ApplicationController
  # before_action :require_authentication, only: %i[ ]
  before_action :find_user
  before_action :require_own_token

  def create
    @user = User.create!(user_params)
    UsersMailer.with(user: @user).confirmation.deliver_later

    redirect_to pending_user_url(@user)
  end

  def pending
    redirect_to root_url if @user.confirmed?
  end

  def confirm
    if @user.confirmed?
      redirect_to root_url, notice: "Thank you. Your account has been confirmed."
    else
      @user.confirm!
      redirect_to new_session_url,
        notice: "Welcome to Taleswapper! Your account has been confirmed. Please sign in to join our community!"
    end
  end

  def resend
    if !@user.confirmed?
      UsersMailer.with(user: @user).confirmation.deliver_later
      redirect_to pending_user_url(@user), notice: "We've resent your confirmation email to #{@user.email_address}."
    else
      redirect_to root_url
    end
  end

  private

  def find_user
    @user = if params[:id]
              User.find(params[:id])
            elsif params[:token]
              User.find_by!(token: params[:token])
            end
  end

  def require_own_token
    return unless Current.user.present? && params[:token].present?
    head :not_found if Current.user.token != params[:token]
  end

  def user_params
    params.require(:user)
      .permit(:display_name, :email_address, :description, :password)
  end
end
