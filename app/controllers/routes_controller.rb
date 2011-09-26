class RoutesController < ApplicationController
	def index
		@routes = Route.all
	end

	def load_coordinates
		@route = Route.find(params[:id])
		render :text => @route.coordinates_string
	end

	# ajax post ze strony glownej po wszystki trasy jako markery
	def start_markers
		@markers = []
		Route.all.each do |route|
			r = []
			r.push route.id
			r.push route.start_lat_lng
			@markers.push r
		end
		render :json => @markers
	end

	def new
		@title_header = "Nowa Trasa"
		@route = Route.new
	end

	def create
		@route = User.first.routes.build(params[:route])
		if @route.save
			flash[:success] = "Trasa zostala dodana"
			redirect_to route_path(@route)
		else
			render 'new'
		end
	end

	def show
		@route = Route.find(params[:id])
		@title_header = "Trasa"
	end
end


