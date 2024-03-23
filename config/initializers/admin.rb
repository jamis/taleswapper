Rails.application.config.after_initialize do
  User.admin_email_address = ENV['ADMIN_EMAIL_ADDRESS']
end
