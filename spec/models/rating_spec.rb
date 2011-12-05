require 'spec_helper'

describe Rating do
  before(:each) do
    @user = Factory(:user)
    @route = Factory(:route, :user => @user)
  end
  it 'ocenia trase' do
    @rating = Factory(:rating, :route => @route, :user => @user)
    # @rating = @user.ratings.new(:value => 3, :route => @route)
    # @rating.save
    @rating.route.should == @route
  end
end