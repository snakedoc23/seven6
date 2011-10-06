class RemoveUserIdAndRouteIdFromComments < ActiveRecord::Migration
  def self.up
  	remove_column :comments, :user_id
  	remove_column :comments, :route_id
  	add_column :comments, :user_id, :integer
  	add_column :comments, :route_id, :integer
  end

  def self.down
  end
end
