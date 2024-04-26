Rails.application.config.after_initialize do
  ActionText::ContentHelper.sanitizer.class.allowed_tags += %w[ aside ts-tracker-updates ts-image ]
  ActionText::ContentHelper.sanitizer.class.allowed_attributes += [ 'style', 'data-updates', 'signed-id', 'filename', 'alt', 'caption', 'ack', 'width', 'height' ]
end
