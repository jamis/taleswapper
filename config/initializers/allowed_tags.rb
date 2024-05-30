Rails.application.config.after_initialize do
  ActionText::ContentHelper.sanitizer.class.allowed_tags += %w[ aside ts-tracker-updates ts-image ts-tracker ]
  ActionText::ContentHelper.sanitizer.class.allowed_attributes += [ 'id', 'style', 'data-updates', 'data-path', 'data-target', 'signed-id', 'filename', 'alt', 'caption', 'ack', 'width', 'height' ]
end
