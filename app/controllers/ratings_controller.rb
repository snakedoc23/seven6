class RatingsController < ApplicationController

	def create
		@route = Route.find(params[:route_id])
		@rating = Rating.new(params[:rating])
		@rating.user_id = current_user.id
		@rating.route_id = @route.id
		
		if @rating.save
			redirect_to route_path(@route.id)

			# render :partial => 'routes/rating_stars'
		else
			flash[:error] = "Ocena nie zostala dodana"
		end
	end

	def update
		@route = Route.find(params[:route_id])
		@rating = current_user.ratings.find_by_route_id(@route.id)

		if @rating.update_attributes(params[:rating])
			redirect_to route_path(@route.id)
		else
			flash[:error] = "Ocena nie zostala dodana"
		end
	end
end
