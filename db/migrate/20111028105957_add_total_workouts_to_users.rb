class AddTotalWorkoutsToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :total_workouts, :integer
    add_column :users, :total_workouts_distance, :float
    add_column :users, :total_workouts_time, :integer
  end

  def self.down
    remove_column :users, :total_workouts
    remove_column :users, :total_workouts_distance
    remove_column :users, :total_workouts_time
  end
end
