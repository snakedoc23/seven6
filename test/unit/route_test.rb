require 'test_helper'

class RouteTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end




# == Schema Information
#
# Table name: routes
#
#  id                 :integer         not null, primary key
#  title              :string(255)
#  description        :text
#  distance           :float
#  surface            :string(255)
#  route_file         :string(255)
#  user_id            :integer
#  created_at         :datetime
#  updated_at         :datetime
#  coordinates_string :text
#  min_altitude       :float
#  max_altitude       :float
#  total_climb_up     :float
#  total_climb_down   :float
#  avg_speed          :float
#  total_time         :float
#  rating             :float
#  pulse_max          :float
#  pulse_avg          :float
#  temperature        :float
#  max_speed          :float
#  start_lat_lng      :string(255)
#  finish_lat_lng     :string(255)
#

