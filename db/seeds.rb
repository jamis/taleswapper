dirs = [ File.expand_path('./seeds/fixtures', __dir__) ]
sets = Dir[File.join(dirs.first, '*.yml')].map { |f| File.basename(f, '.yml').to_sym }

ActiveRecord::FixtureSet.create_fixtures(dirs, sets)
