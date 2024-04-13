Rails.application.config.after_initialize do
  ActionText::ContentHelper.sanitizer.class.allowed_tags += %w[ aside ts-tracker-updates ]
  ActionText::ContentHelper.sanitizer.class.allowed_attributes += [ 'style', 'data-updates' ]
end
