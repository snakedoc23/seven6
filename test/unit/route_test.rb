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
#  id                      :integer         not null, primary key
#  title                   :string(255)
#  description             :text
#  distance                :float
#  surface                 :string(255)
#  user_id                 :integer
#  created_at              :datetime
#  updated_at              :datetime
#  coordinates_string      :text
#  min_altitude            :float
#  max_altitude            :float
#  total_climb_up          :float
#  total_climb_down        :float
#  rating                  :float
#  start_lat_lng           :string(255)
#  finish_lat_lng          :string(255)
#  static_map_name         :string(255)
#  static_map_content_type :string(255)
#  static_map_data         :binary
#  climbs_string           :string(255)
#  total_workouts          :integer
#  total_comments          :integer
#  total_ratings           :integer
#  total_likes             :integer
#

