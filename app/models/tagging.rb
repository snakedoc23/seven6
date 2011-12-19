class Tagging < ActiveRecord::Base
  belongs_to :route
  belongs_to :tag
end

# == Schema Information
#
# Table name: taggings
#
#  id         :integer         not null, primary key
#  route_id   :integer
#  tag_id     :integer
#  created_at :datetime
#  updated_at :datetime
#

