class AddTotalWorkoutsToRoutes < ActiveRecord::Migration
  def self.up
    add_column :routes, :total_workouts, :integer
  end

  def self.down
    remove_column :routes, :total_workouts
  end
end
