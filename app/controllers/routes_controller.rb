class RoutesController < ApplicationController

  before_filter :authenticate, :only => [:new, :create, :edit, :update]

  helper_method :sort_column, :sort_direction

  def compare
    @routes = Route.all(:order => "created_at DESC")
  end

  def compare_routes
    @routes = []
    @routes.push Route.find(params[:first_route_id])
    @routes.push Route.find(params[:second_route_id])
    render :json => @routes
  end

  def index
    @routes = Route.where('distance > ? AND distance < ? AND altitude > ? AND altitude < ? AND surface LIKE ?', distance_min, distance_max, altitude_min, altitude_max, only_road)
                   .search(params[:search]).order(sort_column + " " + sort_direction)
                   .paginate(:page => params[:page], :per_page => 10)
    
    @title_header = "Wszystkie trasy"
  end

  def show
    @route = Route.find(params[:id])
    @user = @route.user
    @tags = @route.tags
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
    @route_file = RouteFile.new
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

    def distance_min
      if params[:distance_min].nil?
        0
      else
        params[:distance_min].empty? ? 0 : params[:distance_min]
      end
    end

    def distance_max
      if params[:distance_max].nil?
        9999
      else
        if params[:distance_max].empty?
          9999
        else
          params[:distance_max] == '100' ? 9999 : params[:distance_max]
        end
      end
    end

    def altitude_min
      if params[:altitude_min].nil?
        0
      else
        params[:altitude_min].empty? ? 0 : params[:altitude_min]
      end
    end

    def only_road
      params[:road] == '1' ? 'asfalt' : '%%'
    end

    def altitude_max
      if params[:altitude_max].nil?
        9999
      else
        if params[:altitude_max].empty?
          9999
        else
          params[:altitude_max] == '400' ? 9999 : params[:altitude_max]
        end
      end
    end

    def sort_column
      Route.column_names.include?(params[:sort]) ? params[:sort] : "created_at"
    end
    
    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
    end
end
