class AddClimbsStringToRoutes < ActiveRecord::Migration
  def self.up
    add_column :routes, :climbs_string, :string
  end

  def self.down
    remove_column :routes, :climbs_string
  end
end
