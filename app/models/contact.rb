class Contact < ActiveRecord::Base
  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :name, :presence => true
  validates :email, :presence => true, :format => { :with => email_regex }
  validates :content, :presence => true
end

# == Schema Information
#
# Table name: contacts
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  email      :string(255)
#  content    :text
#  created_at :datetime
#  updated_at :datetime
#

