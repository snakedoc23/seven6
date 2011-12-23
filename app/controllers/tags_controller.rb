class TagsController < ApplicationController

  def index
    @user = User.find(params[:id])
    @tags = @user.tags
  end

  def show
    @tag = Tag.find(params[:id])
    @routes = @tag.routes
    @user = @tag.user

    @distance = 0;
    @workouts_sum = 0;
    @workouts_time = 0;
    @workouts_distance = 0;
    @tag.routes.each do |route|
      @distance += route.distance
      @workouts_sum += route.workouts.where(:user_id => @user.id).size
      route.workouts.each do |workout|
        if workout.user == @user
          @workouts_time += workout.total_time
          @workouts_distance += workout.route.distance
        end
      end
    end
    @avg_speed = (@workouts_distance * 3600 / @workouts_time).round(2) if @workouts_time > 0
  end
  
end
