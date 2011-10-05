class ChangeUserIdAndRouteIdInComments < ActiveRecord::Migration
  def self.up
  	change_column :comments, :user_id, :integer
  	change_column :comments, :route_id, :integer
  end

  def self.down
  	change_column :comments, :user_id, :string
  	change_column :comments, :route_id, :string
  end
end

