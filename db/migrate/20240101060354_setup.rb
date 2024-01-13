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
      t.belongs_to :creator, null: false
      t.timestamps
      t.datetime   :archived_at
    end

    create_table :chapters do |t|
      t.belongs_to :story
      t.string     :title
      t.boolean    :interactive, default: false
      t.timestamps
      t.datetime   :published_at
    end

    create_table :sections do |t|
      t.belongs_to :chapter, index: false
      t.string :role, default: "left"
      t.text :contents, default: ""
      t.integer :position, null: false, default: 0
      t.timestamps
      t.index %i[ chapter_id position ], unique: true
    end

    create_table :tracker_instances do |t|
      t.belongs_to :section
      t.belongs_to :tracker_version, index: false
    end

    create_table :proposals do |t|
      t.belongs_to :chapter
      t.text :contents, null: false
      t.string :status, null: false, default: 'pending'
      t.text :reason
      t.timestamps
    end

    create_table :proposers do |t|
      t.belongs_to :proposal
      t.belongs_to :user
      t.timestamps
    end

    create_table :actions do |t|
      t.belongs_to :source, index: false
      t.belongs_to :target, index: false
      t.belongs_to :proposal
      t.string :prompt, null: false
      t.integer :position, null: false, default: 0
      t.timestamps
      t.index %i[ source_id position ], unique: true
    end

    create_table :scratch_pads do |t|
      t.belongs_to :story
      t.text :contents, null: false, default: ''
    end

    create_table :trackers do |t|
      t.belongs_to :story
      t.belongs_to :template, index: false
      t.string :name
    end

    create_table :tracker_versions do |t|
      t.belongs_to :tracker, index: false
      t.belongs_to :original
      t.text :data, default: '{}'
      t.timestamps
      t.index %i[ tracker_id created_at ]
    end

    create_table :tracker_templates do |t|
      t.string :name, null: false
      t.belongs_to :creator
      t.string :type, null: false
      t.text :definition
      t.timestamps
    end
  end
end
