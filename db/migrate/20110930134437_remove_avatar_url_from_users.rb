class RemoveAvatarUrlFromUsers < ActiveRecord::Migration
  def self.up
  	remove_column :users, :avatar_url
  end

  def self.down
  end
end
