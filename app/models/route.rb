class Route < ActiveRecord::Base
	attr_accessible :title, :description, :distance, :surface, :route_file

	belongs_to :user
end

# == Schema Information
#
# Table name: routes
#
#  id          :integer         not null, primary key
#  title       :string(255)
#  description :text
#  distance    :decimal(, )
#  surface     :string(255)
#  route_file  :string(255)
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#

