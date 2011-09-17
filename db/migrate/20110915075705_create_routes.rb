class CreateRoutes < ActiveRecord::Migration
  def self.up
    create_table :routes do |t|
      t.string  :title
      t.text    :description
      t.decimal :distance
      t.string  :surface
      t.string  :route_file

      t.integer :user_id

      t.timestamps
    end
    add_index :routes, :title
    add_index :routes, :user_id

  end

  def self.down
    drop_table :routes
  end
end
