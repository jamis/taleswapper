Rails.application.config.after_initialize do
  ActionText::ContentHelper.sanitizer.class.allowed_tags += [ 'ts-roll' ]
end
