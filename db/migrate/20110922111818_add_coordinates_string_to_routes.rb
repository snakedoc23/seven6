class AddCoordinatesStringToRoutes < ActiveRecord::Migration
  def self.up
    add_column :routes, :coordinates_string, :text
  end

  def self.down
    remove_column :routes, :coordinates_string
  end
end
