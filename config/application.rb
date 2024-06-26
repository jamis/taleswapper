require_relative "boot"

require "rails"

%w(
  active_record/railtie
#  active_storage/engine
  action_controller/railtie
  action_view/railtie
  action_mailer/railtie
  active_job/railtie
#  action_cable/engine
#  action_mailbox/engine
  action_text/engine
  rails/test_unit/railtie
).each do |railtie|
  begin # rubocop:disable Style/RedundantBegin
    require railtie
  rescue LoadError
  end
end

require_relative "../lib/middleware/env_expander"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Taleswapper
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    config.middleware.use Middleware::EnvExpander

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w(assets tasks))

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    config.action_mailer.default_url_options = { host: 'taleswapper.org' }

    config.active_record.encryption.encrypt_fixtures = true
  end
end
