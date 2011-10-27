class WorkoutsController < ApplicationController

  def create
    @route = Route.find(params[:route_id])

    @workout = Workout.new
    @workout.time_string = params[:time_string] if params[:time_string].to_f > 0
    @workout.max_speed = params[:max_speed]
    @workout.pulse = params[:pulse] if params[:pulse] != ""
    @workout.temperature = params[:temperature]
    @workout.description = params[:description]
    @workout.user_id = current_user.id
    @workout.route_id = @route.id
    if @workout.save
      # render :partial => 'workout'
      render :text => @workout.pulse.nil?
    else
      render :text => 'fail'
    end
  end
end
