# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_01_01_060354) do
  create_table "actions", force: :cascade do |t|
    t.integer "source_id"
    t.integer "target_id"
    t.string "prompt"
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source_id", "position"], name: "index_actions_on_source_id_and_position", unique: true
    t.index ["target_id"], name: "index_actions_on_target_id"
  end

  create_table "chapters", force: :cascade do |t|
    t.integer "story_id"
    t.string "title"
    t.boolean "interactive", default: false
    t.boolean "start", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "published_at"
    t.index ["story_id"], name: "index_chapters_on_story_id"
  end

  create_table "comments", force: :cascade do |t|
    t.string "commentable_type"
    t.integer "commentable_id"
    t.integer "user_id"
    t.text "contents", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "scratch_pads", force: :cascade do |t|
    t.integer "chapter_id"
    t.string "type", null: false
    t.text "contents", default: "", null: false
    t.integer "position", default: 0, null: false
    t.index ["chapter_id"], name: "index_scratch_pads_on_chapter_id"
  end

  create_table "sections", force: :cascade do |t|
    t.integer "chapter_id"
    t.string "role", default: "primary"
    t.text "contents", default: ""
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chapter_id", "position"], name: "index_sections_on_chapter_id_and_position"
  end

  create_table "stories", force: :cascade do |t|
    t.string "title", null: false
    t.string "subtitle"
    t.text "description"
    t.boolean "interactive", default: false
    t.integer "creator_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "archived_at"
    t.index ["creator_id"], name: "index_stories_on_creator_id"
  end

  create_table "track_sheet_updates", force: :cascade do |t|
    t.integer "section_id"
    t.text "data"
    t.index ["section_id"], name: "index_track_sheet_updates_on_section_id"
  end

  create_table "track_sheets", force: :cascade do |t|
    t.integer "chapter_id"
    t.text "definition"
    t.index ["chapter_id"], name: "index_track_sheets_on_chapter_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "display_name", null: false
    t.text "description"
    t.string "password_digest"
    t.boolean "creator", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
  end

end
