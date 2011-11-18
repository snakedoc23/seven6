require 'test_helper'

class PhotoTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: photos
#
#  id          :integer         not null, primary key
#  title       :string(255)
#  description :string(255)
#  lat_lng     :string(255)
#  file_name   :string(255)
#  file_data   :binary
#  user_id     :integer
#  route_id    :integer
#  altitude    :float
#  created_at  :datetime
#  updated_at  :datetime
#

