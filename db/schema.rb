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
    t.integer "proposal_id"
    t.string "prompt", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["proposal_id"], name: "index_actions_on_proposal_id"
    t.index ["source_id", "position"], name: "index_actions_on_source_id_and_position", unique: true
  end

  create_table "chapters", force: :cascade do |t|
    t.integer "story_id"
    t.string "title"
    t.boolean "interactive", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "published_at"
    t.index ["story_id"], name: "index_chapters_on_story_id"
  end

  create_table "proposals", force: :cascade do |t|
    t.integer "chapter_id"
    t.text "contents", null: false
    t.string "status", default: "pending", null: false
    t.text "reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chapter_id"], name: "index_proposals_on_chapter_id"
  end

  create_table "proposers", force: :cascade do |t|
    t.integer "proposal_id"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["proposal_id"], name: "index_proposers_on_proposal_id"
    t.index ["user_id"], name: "index_proposers_on_user_id"
  end

  create_table "sections", force: :cascade do |t|
    t.integer "chapter_id"
    t.string "role", default: "primary"
    t.text "contents", default: ""
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chapter_id", "position"], name: "index_sections_on_chapter_id_and_position", unique: true
  end

  create_table "stories", force: :cascade do |t|
    t.string "title", null: false
    t.string "subtitle"
    t.text "description"
    t.integer "creator_id", null: false
    t.integer "beginning_id"
    t.integer "setup_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "archived_at"
    t.index ["creator_id"], name: "index_stories_on_creator_id"
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
