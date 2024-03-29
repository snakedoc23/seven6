class CreateRatings < ActiveRecord::Migration
  def self.up
    create_table :ratings do |t|
      t.integer :user_id
      t.integer :route_id
      t.integer :value
      t.boolean :like

      t.timestamps
    end
  end

  def self.down
    drop_table :ratings
  end
end
