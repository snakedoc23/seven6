# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120407095748) do

  create_table "comments", :force => true do |t|
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "route_id"
  end

  add_index "comments", ["route_id"], :name => "index_comments_on_route_id"
  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "contacts", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "photos", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.string   "lat_lng"
    t.string   "file_name"
    t.binary   "file_data"
    t.integer  "user_id"
    t.integer  "route_id"
    t.float    "altitude"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "photos", ["route_id"], :name => "index_photos_on_route_id"
  add_index "photos", ["user_id"], :name => "index_photos_on_user_id"

  create_table "ratings", :force => true do |t|
    t.integer  "user_id"
    t.integer  "route_id"
    t.integer  "value"
    t.boolean  "like"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ratings", ["route_id"], :name => "index_ratings_on_route_id"
  add_index "ratings", ["user_id"], :name => "index_ratings_on_user_id"

  create_table "relationships", :force => true do |t|
    t.integer  "follower_id"
    t.integer  "followed_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "relationships", ["followed_id"], :name => "index_relationships_on_followed_id"
  add_index "relationships", ["follower_id"], :name => "index_relationships_on_follower_id"

  create_table "route_files", :force => true do |t|
    t.string   "name"
    t.string   "content_type"
    t.binary   "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "routes", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.float    "distance"
    t.string   "surface"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "coordinates_string"
    t.float    "min_altitude"
    t.float    "max_altitude"
    t.float    "total_climb_up"
    t.float    "total_climb_down"
    t.float    "rating"
    t.string   "start_lat_lng"
    t.string   "finish_lat_lng"
    t.string   "static_map_name"
    t.string   "static_map_content_type"
    t.binary   "static_map_data"
    t.text     "climbs_string",           :limit => 255
    t.integer  "total_workouts"
    t.integer  "total_comments"
    t.integer  "total_ratings"
    t.integer  "total_likes"
    t.float    "altitude"
  end

  add_index "routes", ["title"], :name => "index_routes_on_title"
  add_index "routes", ["user_id"], :name => "index_routes_on_user_id"

  create_table "taggings", :force => true do |t|
    t.integer  "route_id"
    t.integer  "tag_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "taggings", ["route_id"], :name => "index_taggings_on_route_id"
  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tags", ["user_id"], :name => "index_tags_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "name"
    t.string   "email"
    t.integer  "age"
    t.string   "place"
    t.boolean  "gender"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "encrypted_password"
    t.string   "salt"
    t.boolean  "admin"
    t.integer  "total_routes"
    t.integer  "total_distance"
    t.string   "avatar_name"
    t.string   "avatar_content_type"
    t.binary   "avatar_data"
    t.integer  "total_workouts"
    t.float    "total_workouts_distance"
    t.integer  "total_workouts_time"
  end

  add_index "users", ["username"], :name => "index_users_on_username", :unique => true

  create_table "workouts", :force => true do |t|
    t.text     "description"
    t.float    "total_time"
    t.float    "avg_speed"
    t.float    "max_speed"
    t.float    "pulse_max"
    t.float    "pulse_avg"
    t.float    "temperature"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "route_id"
  end

  add_index "workouts", ["route_id"], :name => "index_workouts_on_route_id"
  add_index "workouts", ["user_id"], :name => "index_workouts_on_user_id"

end
