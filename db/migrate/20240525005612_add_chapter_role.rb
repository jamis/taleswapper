class AddChapterRole < ActiveRecord::Migration[7.1]
  def up
    add_column :chapters, :role, :string

    Chapter.where(start: true).update_all(role: 'start')

    remove_column :chapters, :start
  end

  def down
    add_column :chapters, :start, :boolean

    Chapter.where(role: 'start').update_all(start: true)

    remove_column :chapters, :role
  end
end
