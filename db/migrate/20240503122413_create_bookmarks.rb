class CreateBookmarks < ActiveRecord::Migration[7.1]
  def change
    create_table :bookmarks do |t|
      t.belongs_to :user, index: false
      t.belongs_to :chapter
      t.string :anchor, null: false
      t.string :name, null: false
      t.text :description
      t.timestamps

      t.index %i[ user_id chapter_id ]
    end
  end
end
