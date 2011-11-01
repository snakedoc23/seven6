class AddTotalCommentsAndTotalRatingsToRoute < ActiveRecord::Migration
  def self.up
    add_column :routes, :total_comments, :integer
    add_column :routes, :total_ratings, :integer
  end

  def self.down
    remove_column :routes, :total_ratings
    remove_column :routes, :total_comments
  end
end
