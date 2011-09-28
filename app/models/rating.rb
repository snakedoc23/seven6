class Rating < ActiveRecord::Base
	attr_accessible :value, :like
	belongs_to :user
	belongs_to :route
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

