require 'spec_helper'

describe Route do
  before(:each) do
    @user = User.create!(
      :username => 'test',
      :email => 'test@example.com',
      :password => 'test123',
      :password_confirmation => 'test123'
    )
    @route = @user.routes.build(
      :title => "test",
      :description => "test test test",
      :coordinates_string => "40.808291,-74.025858|40.806212,-74.0147|40.798675,-74.014357|40.789708,-74.017104",
      :distance =>  2.83,
      :surface => "asfalt",
      :max_altitude => 100.00,
      :min_altitude => 50.00
    )
  end
  it 'tworzy nowa trase' do
    @route.save
  end
  it 'wymaga tytulu przynajmniej dwa znaki' do
    @route.title = 'x'
    @route.should_not be_valid
  end
  it 'coordinates_string nie moze byc puste' do
    @route.coordinates_string = ''
    @route.should_not be_valid
  end

  describe 'po zapisie' do
    before do
      @route.save
    end
    it 'tworzy start_lat_lng' do
      @route.start_lat_lng == "40.808291,-74.025858"
    end
    it 'tworzy finish_lat_lng' do
      @route.finish_lat_lng == "40.789708,-74.017104"
    end
    it 'calculate_altitude zwraca roznice podjazdow' do
      @route.altitude.should == 50
    end
    it '.user zwraca usera' do
      @route.user.should == @user
    end
    it '@user.routes zwraca tablice z trasa' do
      @user.routes.should == [@route]
    end
    it 'dodaje do urzytkownika total_distance i total_routes' do
      @user.add_total_routes_and_distance
      @user.total_distance.should == 3
      @user.total_routes.should == 1
    end
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
#  altitude                :float
#

