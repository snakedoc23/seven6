class CreatePhotos < ActiveRecord::Migration
  def self.up
    create_table :photos do |t|
      t.string :title
      t.string :description
      t.string :lat_lng
      t.string :file_name
      t.binary :file_data
      t.integer :user_id
      t.integer :route_id
      t.float :altitude

      t.timestamps
    end
    add_index :photos, :route_id
    add_index :photos, :user_id
  end

  def self.down
    drop_table :photos
  end
end
