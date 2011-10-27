require 'test_helper'

class WorkoutTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: workouts
#
#  id          :integer         not null, primary key
#  route_id    :string(255)
#  user_id     :string(255)
#  description :text
#  total_time  :float
#  avg_speed   :float
#  max_speed   :float
#  pulse_max   :float
#  pulse_avg   :float
#  temperature :float
#  created_at  :datetime
#  updated_at  :datetime
#

