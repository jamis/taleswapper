class AddAnnouncementFields < ActiveRecord::Migration[7.1]
  def initialize_announced_at
    Story.find_each do |story|
      starter = story.chapters.starter.first
      story.update announced_at: starter.published_at if starter&.published?
    end

    Chapter.find_each do |chapter|
      chapter.update announced_at: chapter.published_at if chapter.published?
    end
  end

  def change
    change_table :stories do |t|
      t.column :announced_at, :datetime
    end

    change_table :chapters do |t|
      t.column :announced_at, :datetime
    end

    if Story.column_names.include?('announced_at')
      initialize_announced_at
    end
  end
end
