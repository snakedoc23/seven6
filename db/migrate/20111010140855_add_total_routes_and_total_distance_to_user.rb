class AddTotalRoutesAndTotalDistanceToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :total_routes, :integer
    add_column :users, :total_distance, :integer
  end

  def self.down
    remove_column :users, :total_distance
    remove_column :users, :total_routes
  end
end
