class AddStaticMapToRoute < ActiveRecord::Migration
  def self.up
    add_column :routes, :static_map, :string
  end

  def self.down
    remove_column :routes, :static_map
  end
end
