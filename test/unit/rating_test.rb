require 'test_helper'

class RatingTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
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

