class Rating < ActiveRecord::Base
	attr_accessible :value, :like
	belongs_to :user
	belongs_to :route

	scope :likes, lambda {|id| where(:user_id => id, :like => true)}
	scope :route_likes, lambda {|id| where(:route_id => id, :like => true)}
	scope :route_ratings, lambda {|id| where('value > ? AND route_id == ?', '0', id)}

	after_save :add_total_likes_to_route

	def add_total_likes_to_route
		self.route.add_total_likes if self.like
		self.route.avg_rating if self.value
	end
end

# == Schema Information
#
# Table name: ratings
#
#  id         :integer         not null, primary key
#  user_id    :integer
#  route_id   :integer
#  value      :integer
#  like       :boolean
#  created_at :datetime
#  updated_at :datetime
#

