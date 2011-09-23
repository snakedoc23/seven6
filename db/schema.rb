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

ActiveRecord::Schema.define(:version => 20110923072524) do

  create_table "routes", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.float    "distance"
    t.string   "surface"
    t.string   "route_file"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "coordinates_string"
    t.float    "min_altitude"
    t.float    "max_altitude"
    t.float    "total_climb_up"
    t.float    "total_climb_down"
    t.float    "avg_speed"
    t.float    "total_time"
    t.float    "rating"
    t.float    "pulse_max"
    t.float    "pulse_avg"
    t.float    "temperature"
    t.float    "max_speed"
  end

  add_index "routes", ["title"], :name => "index_routes_on_title"
  add_index "routes", ["user_id"], :name => "index_routes_on_user_id"

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
    t.string   "avatar_url"
    t.boolean  "admin"
  end

  add_index "users", ["username"], :name => "index_users_on_username", :unique => true

end
