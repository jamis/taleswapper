# If ENV_MAPPINGS environment variable is present, it must be a comma-delimited
# list of name=value pairs. The 'name' is an alias for an existing environment
# variable, and 'value' is the variable that 'name' is aliasing.
#
# In other words, suppose we have some vendor-specific environment variable
# that is being set (e.g. 'CACHE_WORLD_HOSTS'), but the application expects
# something more general (e.g 'MEMCACHE_SERVERS'). We could set the
# ENV_MAPPINGS variable to "MEMCACHE_SERVERS=CACHE_WORLD_HOSTS", and this
# middleware would perform the translation for us.

class EnvExpander
  def initialize(app)
    @app = app
  end

  def call(env)
    env_mappings.each do |env_alias, env_var|
      ENV[env_alias] = ENV[env_var]
    end

    @app.call(env)
  end

  private

  def env_mappings
    source = (ENV['ENV_MAPPINGS'] || '')
    Hash[source.split(/,/).map { |pair| pair.split(/=/, 2) }]
  end
end
