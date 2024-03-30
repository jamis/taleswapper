class SoftDeleteStories < ActiveRecord::Migration[7.1]
  def change
    change_table :stories do |t|
      t.column :deleted_at, :datetime, index: true
    end
  end
end
