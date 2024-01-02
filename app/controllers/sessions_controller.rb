class SessionsController < ApplicationController
  def create
    user = User.find_by(email_address: session_params[:email_address])

    if authenticate(user, session_params[:password])
      redirect_to root_url
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
end
