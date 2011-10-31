class ChangeWorkoutColumns < ActiveRecord::Migration
  def self.up
  	remove_column :workouts, :user_id
  	remove_column :workouts, :route_id
  	add_column :workouts, :user_id, :integer
  	add_column :workouts, :route_id, :integer
  end

  def self.down
  end
end
