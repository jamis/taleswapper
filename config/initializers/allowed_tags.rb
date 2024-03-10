Rails.application.config.after_initialize do
  # ActionText::ContentHelper.sanitizer.class.allowed_tags += [ 'custom-tag' ]
  ActionText::ContentHelper.sanitizer.class.allowed_attributes += [ 'style' ]
end
