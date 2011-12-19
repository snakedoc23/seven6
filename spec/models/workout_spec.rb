require 'spec_helper'

describe 'Workout' do
  before(:each) do
    @user = Factory(:user)
    @route = Factory(:route, :user => @user)
  end

  it 'dodaj przejazd' do
    @w = Workout.new
    @w.time_string = "0 10"
    @w.max_speed = 31
    @w.pulse = "123/151"
    @w.temperature = 20
    @w.description = "opis przejazdu"
    @w.route_id = @route.id
    @w.user_id = @user.id
    @w.save
  end
  describe 'dodana trasa' do
    before(:each) do
      @w = Workout.new
      @w.time_string = "0 10"
      @w.max_speed = 31
      @w.pulse = "123/151"
      @w.temperature = 20
      @w.description = "opis przejazdu"
      @w.route_id = @route.id
      @w.user_id = @user.id
      @w.save
    end
    it 'zwraca uzytkownika' do
      @w.user.should == @user
    end
    it 'zwraca trase' do
      @w.route.should == @route
    end
    it 'user total_workouts' do
      @user.add_total_workouts
      @user.total_workouts.should == 1
    end
    it 'route total_workouts' do
      @route.add_total_workouts
      @route.total_workouts.should == 1
    end
    it 'split_pulse' do
      @w.pulse_max.should == 151
      @w.pulse_avg.should == 123
    end
    it 'total_time_calculate' do
      @w.total_time.should == 600
      @w.time_string = "1-10"
      @w.save
      @w.total_time.should == 4200
    end
    it 'calculate_avg_speed' do
      @w.avg_speed.should == 16.98
    end
  end

end

# == Schema Information
#
# Table name: workouts
#
#  id          :integer         not null, primary key
#  description :text
#  total_time  :float
#  avg_speed   :float
#  max_speed   :float
#  pulse_max   :float
#  pulse_avg   :float
#  temperature :float
#  created_at  :datetime
#  updated_at  :datetime
#  user_id     :integer
#  route_id    :integer
#

