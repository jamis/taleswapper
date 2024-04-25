# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative "config/application"

Rails.application.load_tasks

Rake::Task["assets:precompile"].enhance do
  Rake::Task["tinymce"].invoke
end

task tinymce: "environment" do
  source_root = Rails.root.join('node_modules', 'tinymce')
  target_root = Rails.root.join('public', 'assets', 'tinymce')

  rm_rf target_root

  puts "copying tinymce assets..."

  %w[
    tinymce.min.js
    themes/silver/theme.min.js
    models/dom/model.min.js
    icons/default/icons.min.js
    plugins/link/plugin.min.js
    plugins/lists/plugin.min.js
    skins/ui/oxide/skin.min.css
    skins/ui/oxide/content.inline.min.css
  ].each do |file|
    source = File.join(source_root, file)
    target = File.join(target_root, file)

    mkdir_p File.dirname(target)
    cp source, target
  end
end
