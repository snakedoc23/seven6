class RemoveColumnsFromRoute < ActiveRecord::Migration
  def self.up
  	remove_column :routes, :route_file
  	remove_column :routes, :avg_speed
  	remove_column :routes, :total_time
  	remove_column :routes, :pulse_max
  	remove_column :routes, :pulse_avg
  	remove_column :routes, :temperature
  	remove_column :routes, :max_speed
  end

  def self.down
  	add_column :routes, :route_file, :string
  	add_column :routes, :avg_speed, :float
  	add_column :routes, :total_time, :float
  	add_column :routes, :pulse_max, :float
  	add_column :routes, :pulse_avg, :float
  	add_column :routes, :temperature, :float
  	add_column :routes, :max_speed, :float
  end
end
