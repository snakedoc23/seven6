module RoutesHelper

	def rate_route
		if @rating = current_user.ratings.find_by_route_id(params[:id])
			@rating 	#update
		else
			current_user.ratings.new	#create
		end
	end
end
