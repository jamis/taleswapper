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

ActiveRecord::Schema[7.1].define(version: 2024_05_03_122413) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "actions", force: :cascade do |t|
    t.bigint "source_id"
    t.bigint "target_id"
    t.string "prompt"
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source_id", "position"], name: "index_actions_on_source_id_and_position", unique: true
    t.index ["target_id"], name: "index_actions_on_target_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "bookmarks", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "chapter_id"
    t.string "anchor", null: false
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chapter_id"], name: "index_bookmarks_on_chapter_id"
    t.index ["user_id", "chapter_id"], name: "index_bookmarks_on_user_id_and_chapter_id"
  end

  create_table "chapters", force: :cascade do |t|
    t.bigint "story_id"
    t.string "title"
    t.boolean "interactive", default: false
    t.boolean "start", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "published_at"
    t.datetime "announced_at"
    t.index ["story_id"], name: "index_chapters_on_story_id"
  end

  create_table "comments", force: :cascade do |t|
    t.string "commentable_type"
    t.bigint "commentable_id"
    t.bigint "user_id"
    t.text "contents", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "scratch_pads", force: :cascade do |t|
    t.bigint "chapter_id"
    t.string "type", null: false
    t.text "contents", default: "", null: false
    t.integer "position", default: 0, null: false
    t.index ["chapter_id"], name: "index_scratch_pads_on_chapter_id"
  end

  create_table "stories", force: :cascade do |t|
    t.string "title", null: false
    t.string "subtitle"
    t.text "description"
    t.boolean "interactive", default: false
    t.bigint "creator_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "archived_at"
    t.datetime "deleted_at"
    t.datetime "announced_at"
    t.index ["creator_id"], name: "index_stories_on_creator_id"
    t.index ["deleted_at"], name: "index_stories_on_deleted_at"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.bigint "user_id"
    t.string "subscribable_type"
    t.bigint "subscribable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["subscribable_type", "subscribable_id"], name: "index_subscriptions_on_subscribable"
    t.index ["user_id", "subscribable_type", "subscribable_id"], name: "idx_on_user_id_subscribable_type_subscribable_id_fb68f3bd3a", unique: true
  end

  create_table "track_sheets", force: :cascade do |t|
    t.bigint "chapter_id"
    t.text "definition"
    t.index ["chapter_id"], name: "index_track_sheets_on_chapter_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", limit: 510, null: false
    t.string "display_name", limit: 510, null: false
    t.text "description"
    t.string "password_digest"
    t.boolean "creator", default: false
    t.string "token", null: false
    t.datetime "confirmed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["display_name"], name: "index_users_on_display_name", unique: true
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
    t.index ["token"], name: "index_users_on_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
end
