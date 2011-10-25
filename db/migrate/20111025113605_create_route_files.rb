class CreateRouteFiles < ActiveRecord::Migration
  def self.up
    create_table :route_files do |t|
      t.string :name
      t.string :content_type
      t.binary :data

      t.timestamps
    end
  end

  def self.down
    drop_table :route_files
  end
end
