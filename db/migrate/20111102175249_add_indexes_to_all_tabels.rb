class AddIndexesToAllTabels < ActiveRecord::Migration
  def self.up
    add_index :comments, 	:route_id
    add_index :comments, 	:user_id
    add_index :ratings, 	:route_id
    add_index :ratings, 	:user_id
    add_index :workouts, 	:route_id
    add_index :workouts, 	:user_id
  end

  def self.down
    remove_index :comments, 	:route_id
    remove_index :comments, 	:user_id
    remove_index :ratings, 		:route_id
    remove_index :ratings, 		:user_id
    remove_index :workouts, 	:route_id
    remove_index :workouts, 	:user_id
  end
end
