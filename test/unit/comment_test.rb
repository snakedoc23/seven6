require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: comments
#
#  id         :integer         not null, primary key
#  user_id    :string(255)
#  route_id   :string(255)
#  content    :text
#  created_at :datetime
#  updated_at :datetime
#

