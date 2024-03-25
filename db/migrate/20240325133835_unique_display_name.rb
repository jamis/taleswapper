class UniqueDisplayName < ActiveRecord::Migration[7.1]
  def change
    add_index :users, :display_name, unique: true

    ActiveRecord::Base.partial_updates = false
    User.find_each(&:save!)
  end
end
