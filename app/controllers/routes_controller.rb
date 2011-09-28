class RoutesController < ApplicationController

  before_filter :authenticate, :only => [:new, :create, :edit, :update]
  def index
    @routes = Route.search(params[:search]).paginate(:page => params[:page], :per_page => 10)
    @title_header = "Wszystkie trasy"
  end

  def show
    @route = Route.find(params[:id])
    @title_header = "Trasa"

    if current_user
      if @rating = current_user.ratings.find_by_route_id(params[:id])
        @rating
      else
        @rating = current_user.ratings.new
      end
    end
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
    @route = current_user.routes.build(params[:route])
    if @route.save
      flash[:success] = "Trasa zostala dodana"
      redirect_to route_path(@route)
    else
      render 'new'
    end
  end


  def edit
    @route = Route.find(params[:id])
    @title_header = "Edytuj trase"
  end
  
  def update
    @route = Route.find(params[:id])
    if @route.update_attributes(params[:route])
      flash[:success] = "Dane zostaly zaktualizowane"
      redirect_to @route
    else
      flash[:error] = "Cos poszlo nie tak"
      render 'edit'
    end
  end


end


