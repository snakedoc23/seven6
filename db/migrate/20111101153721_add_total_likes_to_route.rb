class AddTotalLikesToRoute < ActiveRecord::Migration
  def self.up
    add_column :routes, :total_likes, :integer
  end

  def self.down
    remove_column :routes, :total_likes
  end
end
