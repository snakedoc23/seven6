class RouteFilesController < ApplicationController

  def create
    @route_file = RouteFile.new(params[:route_file])
    if @route_file.save
      @title_header = "Nowa Trasa"
      @route = Route.new
      @route.coordinates_string = @route_file.parse_file
      render 'routes/new'
    end
  end

  def update
    @route_file = RouteFile.new(params[:route_file])
    if @route_file.save
    
      @title_header = "Nowa Trasa"
      @route = Route.new
      # @route.coordinates_string = "50.277493,19.005747|50.276616,19.040251|50.266631,19.05879|50.254011,19.045229"
      
      # table = @route_file.data.split("<coordinates>")[1].split("</coordinates>")[0].split(" ")

      # string = ""
      # table.each_with_index do |line, index|
      #   string += "#{line.split(",")[1]},#{line.split(",")[0]}"
      #   if index < table.length - 1
      #     string += "|"
      #   end
      # end
      # @route.coordinates_string = string
      # # render :text => @route.coordinates_string

      @route.coordinates_string = @route_file.parse_file
      render 'routes/new'
    end
  end
end
