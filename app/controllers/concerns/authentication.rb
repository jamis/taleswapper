module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_session
    helper_method :authenticated?
  end

  private

  def require_authentication
    redirect_to new_session_url unless authenticated?
    redirect_to pending_user_url(Current.user) unless Current.user.confirmed?
  end

  def authenticated?
    Current.user.present?
  end

  def authenticate(user, password = nil)
    if user && (password.nil? || user.authenticate(password))
      cookies.encrypted[:user_id] = user.id
      Current.user = user
      return true
    end

    false
  end

  def deauthenticate!
    Current.user = nil
    cookies.delete :user_id
  end

  def authenticate_session
    if user = User.find_by(id: cookies.encrypted[:user_id])
      Current.user = user
    end
  end
end
