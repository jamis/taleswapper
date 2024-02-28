# Preview all emails at http://localhost:3000/rails/mailers/users_mailer
class UsersMailerPreview < ActionMailer::Preview
  def confirmation
    UsersMailer.with(user: User.first).confirmation
  end
end
