class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :route
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

