class UsersMailer < ApplicationMailer
  def confirmation
    @user = params[:user]
    mail to: @user.email_address,
         subject: 'Confirm your Taleswapper account'
  end
end
