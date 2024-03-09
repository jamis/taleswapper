dir = File.expand_path('./seeds/fixtures', __dir__)
sets = Dir[File.join(dir, '**', '*.yml')].map { |f| f[(dir.length + 1)..-5] }

ActiveRecord::FixtureSet.create_fixtures([ dir ], sets)
