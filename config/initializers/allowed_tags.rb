Rails.application.config.after_initialize do
  ActionText::ContentHelper.sanitizer.class.allowed_tags += %w[ aside ts-tracker-updates ts-image ]
  ActionText::ContentHelper.sanitizer.class.allowed_attributes += [ 'style', 'data-updates', 'src', 'alt', 'caption', 'ack', 'metadata' ]
end
