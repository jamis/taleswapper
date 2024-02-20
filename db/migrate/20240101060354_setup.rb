class Setup < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email_address, null: false, index: { unique: true }
      t.string :display_name, null: false
      t.text :description
      t.string :password_digest
      t.boolean :creator, default: false
      t.timestamps
    end

    create_table :stories do |t|
      t.string     :title, null: false
      t.string     :subtitle
      t.text       :description
      t.boolean    :interactive, default: false
      t.belongs_to :creator, null: false
      t.timestamps
      t.datetime   :archived_at
    end

    create_table :chapters do |t|
      t.belongs_to :story
      t.string     :title
      t.boolean    :interactive, default: false
      t.boolean    :start, default: false
      t.timestamps
      t.datetime   :published_at
    end

    create_table :sections do |t|
      t.belongs_to :chapter, index: false
      t.string :role, default: "primary"
      t.text :contents, default: ""
      t.integer :position, null: false, default: 0
      t.timestamps
      t.index %i[ chapter_id position ]
    end

    create_table :comments do |t|
      t.belongs_to :commentable, polymorphic: true
      t.belongs_to :user
      t.text :contents, null: false, default: ''
      t.timestamps
    end

    create_table :actions do |t|
      t.belongs_to :source, index: false
      t.belongs_to :target
      t.string :prompt
      t.integer :position, null: false, default: 0
      t.timestamps
      t.index %i[ source_id position ], unique: true
    end

    create_table :scratch_pads do |t|
      t.belongs_to :chapter
      t.string :type, null: false
      t.text :contents, null: false, default: ''

      # remember the cursor position when the user last viewed this scratch pad
      t.integer :position, null: false, default: 0
    end

    create_table :track_sheets do |t|
      t.belongs_to :chapter
      t.text :definition
    end

    create_table :track_sheet_updates do |t|
      t.belongs_to :section
      t.text :data
    end
  end
end
