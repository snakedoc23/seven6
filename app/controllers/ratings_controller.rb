class RatingsController < ApplicationController

	def add_rating
		@route = Route.find(params[:route_id])
		@value = params[:value]
		if @rating = current_user.ratings.find_by_route_id(@route.id)
			# update
			if @rating.update_attributes(:value => @value)
				@route.rating = @route.avg_rating
				@route.save
				render :text => @route.rating
			else
				# nie zapisalo sie
			end
		else
			# new
			@rating = Rating.new
			@rating.value = @value
			@rating.user_id = current_user.id
			@rating.route_id = @route.id
			if @rating.save
				@route.rating = @route.avg_rating
				@route.save
				render :text => @route.rating
			else
				# nie zapisalo sie
			end

		end
	end

	def add_like
		@route = Route.find(params[:route_id])
		@like = params[:like]
		@like = nil unless @like == 'true'

		if @rating = current_user.ratings.find_by_route_id(@route.id)
			@rating.update_attributes(:like => @like)
			@rating.save
			render :text => @like
		else
			@rating = Rating.new
			@rating.user_id = current_user.id
			@rating.route_id = @route.id
			@rating.like = @like
			@rating.save
			render :text => "OK create"
		end
	end

end
