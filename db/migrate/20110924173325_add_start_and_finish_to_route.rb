class AddStartAndFinishToRoute < ActiveRecord::Migration
  def self.up
    add_column :routes, :start_lat_lng, :string
    add_column :routes, :finish_lat_lng, :string
  end

  def self.down
    remove_column :routes, :finish_lat_lng
    remove_column :routes, :start_lat_lng
  end
end
