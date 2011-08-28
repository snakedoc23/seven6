require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end




# == Schema Information
#
# Table name: users
#
#  id                 :integer         not null, primary key
#  username           :string(255)
#  name               :string(255)
#  email              :string(255)
#  age                :integer
#  palce              :string(255)
#  gender             :boolean
#  created_at         :datetime
#  updated_at         :datetime
#  encrypted_password :string(255)
#  salt               :string(255)
#  avatar_url         :string(255)
#

