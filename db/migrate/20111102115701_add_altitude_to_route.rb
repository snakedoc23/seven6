class AddAltitudeToRoute < ActiveRecord::Migration
  def self.up
    add_column :routes, :altitude, :float
  end

  def self.down
    remove_column :routes, :altitude
  end
end
