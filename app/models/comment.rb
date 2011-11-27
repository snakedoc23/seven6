class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :route

  validates :content, :presence => true, :length => { :maximum => 150 }

	after_save :add_total_comments_to_route

	scope :route_comments, lambda {|id| where(:route_id => id)}

	def add_total_comments_to_route
		self.route.add_total_comments
	end
end


# == Schema Information
#
# Table name: comments
#
#  id         :integer         not null, primary key
#  content    :text
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
#  route_id   :integer
#

