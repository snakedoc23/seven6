class Tag < ActiveRecord::Base
  has_many :taggings, :dependent => :destroy
  has_many :routes, :through => :taggings
  belongs_to :user
end

# == Schema Information
#
# Table name: tags
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  user_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

