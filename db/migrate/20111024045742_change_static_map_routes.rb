class ChangeStaticMapRoutes < ActiveRecord::Migration
  def self.up
  	remove_column :routes, :static_map
  	add_column :routes, :static_map_name, :string
  	add_column :routes, :static_map_content_type, :string
  	add_column :routes, :static_map_data, :binary
  end

  def self.down
  	add_column :routes, :static_map
  	remove_column :routes, :static_map_name, :string
  	remove_column :routes, :static_map_content_type, :string
  	remove_column :routes, :static_map_data, :binary
  end
end
