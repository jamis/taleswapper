class SessionsController < ApplicationController
  def create
    user = User.find_by(email_address: session_params[:email_address])

    if authenticate(user, session_params[:password])
      redirect_to origin_url || root_url, notice: "Welcome back, #{user.display_name}!"
    else
      redirect_to new_session_url
    end
  end

  def destroy
    deauthenticate!
    redirect_back_or_to root_url
  end

  private

  def session_params
    @session_params ||= params.require(:session).permit(:email_address, :password)
  end

  def origin_url
    params[:origin_url].presence
  end
end
