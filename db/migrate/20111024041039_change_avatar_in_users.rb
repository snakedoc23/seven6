class ChangeAvatarInUsers < ActiveRecord::Migration
  def self.up
  	remove_column :users, :avatar
  	add_column :users, :avatar_name, :string
  	add_column :users, :avatar_content_type, :string
  	add_column :users, :avatar_data, :binary
  end

  def self.down
  	add_column :users, :avatar
  	remove_column :users, :avatar_name, :string
  	remove_column :users, :avatar_content_type, :string
  	remove_column :users, :avatar_data, :binary
  end
end
