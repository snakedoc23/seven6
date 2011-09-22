class RoutesController < ApplicationController
	def index
		@routes = Route.all
	end

	def new
		@title_header = "Nowa Trasa"
		@route = Route.new
	end

	def show
		@route = Route.find(params[:id])
		@title_header = "Trasa"
	end
end
