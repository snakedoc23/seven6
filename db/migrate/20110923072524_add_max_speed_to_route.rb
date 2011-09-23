class AddMaxSpeedToRoute < ActiveRecord::Migration
  def self.up
    add_column :routes, :max_speed, :float
  end

  def self.down
    remove_column :routes, :max_speed
  end
end
