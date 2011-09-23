class AddSeveralColumnsToRoute < ActiveRecord::Migration
  def self.up
    add_column :routes, :min_altitude, 		:float
    add_column :routes, :max_altitude, 		:float
    add_column :routes, :total_climb_up, 	:float
    add_column :routes, :total_climb_down, 	:float
    add_column :routes, :avg_speed, 		:float
    add_column :routes, :total_time,	 	:float
    add_column :routes, :rating,		 	:float
    add_column :routes, :pulse_max,		 	:float
    add_column :routes, :pulse_avg,		 	:float
    add_column :routes, :temperature,		:float

    change_column :routes, :distance, 		:float
  end

  def self.down
    remove_column :routes, :max_altitude
    remove_column :routes, :min_altitude
    remove_column :routes, :total_climb_up
    remove_column :routes, :total_climb_down
    remove_column :routes, :avg_speed
    remove_column :routes, :total_time
    remove_column :routes, :rating
    remove_column :routes, :pulse_max
    remove_column :routes, :pulse_avg
    remove_column :routes, :temperature

    change_column :routes, :distance, :decimal
  end
end
