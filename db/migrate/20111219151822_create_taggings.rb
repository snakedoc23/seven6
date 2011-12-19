class CreateTaggings < ActiveRecord::Migration
  def self.up
    create_table :taggings do |t|
      t.integer :route_id
      t.integer :tag_id

      t.timestamps
    end
    add_index :taggings, :route_id
    add_index :taggings, :tag_id
  end

  def self.down
    drop_table :taggings
  end
end
