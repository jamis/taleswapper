class UsersController < ApplicationController
  before_action :find_user
  before_action :require_own_token
  before_action :require_self_or_admin, only: %i[ show edit update destroy cancel ]

  def create
    @user = User.create!(user_params)
    UsersMailer.with(user: @user).confirmation.deliver_later

    redirect_to pending_user_url(@user)
  rescue ActiveRecord::RecordInvalid => e
    @user = e.record
    render 'new'
  end

  def update
    @user.update!(user_params)
    redirect_to user_url(@user), notice: "Your profile has been updated."
  rescue ActiveRecord::RecordInvalid => e
    render 'edit'
  end

  def destroy
    if params[:confirm] != @user.display_name
      @user.errors.add(:base, :cancel_confirmation_blank, message: "You must confirm your display name.")
      render 'cancel'
    else
      deauthenticate! if Current.user == @user
      @user.destroy
      redirect_to root_url, notice: "Your Taleswapper account has been closed."
    end
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

  USER_PARAMS = %i[ display_name email_address description password ]
  ADMIN_USER_PARAMS = [ *USER_PARAMS, :creator ]

  def user_params
    permitted_params = Current.user.admin? ? ADMIN_USER_PARAMS : USER_PARAMS
    params.require(:user).permit(*permitted_params).tap do |user|
      user.delete(:password) if user[:password].blank?
    end
  end

  def require_self_or_admin
    return unless require_authentication

    if Current.user != @user && !Current.user.admin?
      redirect_back_or_to root_url
    end
  end
end
