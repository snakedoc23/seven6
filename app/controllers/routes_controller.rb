class RoutesController < ApplicationController

  before_filter :authenticate, :only => [:new, :create, :edit, :update]

  helper_method :sort_column, :sort_direction

  def index
    @routes = Route.search(params[:search]).order(sort_column + " " + sort_direction).paginate(:page => params[:page], :per_page => 10)
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

  # ajax post ze strony glownej i show users po wszystki trasy jako markery
  def start_markers

    # @user = User.find(params[:user_id])
    @markers = []

    if params[:route_type] == 'added'

      if params[:user_id] == "0" 
        Route.all.each do |route|
          r = []
          r.push route.id
          r.push route.start_lat_lng
          r.push route.title
          r.push route.distance
          r.push route.user.username
          @markers.push r
        end
      else 
        Route.where(:user_id => params[:user_id]).each do|route|
          r = []
          r.push route.id
          r.push route.start_lat_lng
          r.push route.title
          r.push route.distance
          r.push route.user.username
          @markers.push r
        end
      end

    elsif params[:route_type] == 'favorite'
      @user = User.find(params[:user_id])
      Rating.likes(@user.id).each do |rat|
        r = []
        r.push rat.route.id
        r.push rat.route.start_lat_lng
        r.push rat.route.title
        r.push rat.route.distance
        r.push rat.route.user.username
        @markers.push r
      end

    elsif params[:route_type] == 'following'
      @user = User.find(params[:user_id])
      @user.following_routes.each do |route|
        r = []
        r.push route.id
        r.push route.start_lat_lng
        r.push route.title
        r.push route.distance
        r.push route.user.username
        @markers.push r
      end

    end 

    render :json => @markers
  end

  def new
    @title_header = "Nowa Trasa"
    @route = Route.new
    @route_file = RouteFile.new
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

  def destroy
    Route.find(params[:id]).destroy
    flash[:success] = "Trasa zostala usunieta"
    redirect_to user_path(current_user)
    
  end

  private

    def sort_column
      Route.column_names.include?(params[:sort]) ? params[:sort] : "created_at"
    end
    
    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
    end

end


