class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :route

	scope :route_comments, lambda {|id| where(:route_id => id)}
end


# == Schema Information
#
# Table name: comments
#
#  id         :integer         not null, primary key
#  user_id    :integer(255)
#  route_id   :integer(255)
#  content    :text
#  created_at :datetime
#  updated_at :datetime
#

