class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments do |t|
      t.string :user_id
      t.string :route_id
      t.text :content

      t.timestamps
    end

    add_index :comments, :route_id
    add_index :comments, :user_id
  end

  def self.down
    drop_table :comments
  end
end
