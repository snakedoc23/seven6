class UsersController < ApplicationController
  
  before_filter :authenticate, :only => [:edit, :update]
  before_filter :correct_user, :only => [:edit, :update]
  before_filter :admin_user,   :only => :destroy

  helper_method :sort_column, :sort_direction
  
  def index
    # @users = User.paginate(:page => params[:page], :per_page => 20)
    @title_header = "Uzytkownicy"
    @users = User.search(params[:search]).order(sort_column + " " + sort_direction).paginate(:page => params[:page], :per_page => 20)

  end
  
  def show
    @user = User.find(params[:id])
    @title_header = "Profil #{@user.username}"
    @routes_all = Route.user_routes(@user.id)
    @routes = Route.last_three(@user.id)
    @routes = Route.find_all_by_user_id @user.id, :order => "created_at DESC", :limit => 3
    @total_distance = 0
    @total_distance_with_time = 0
    @total_time = 0
    @routes_all.each do |route|
      @total_distance += route.distance
      if route.total_time > 0
        @total_time += route.total_time
        @total_distance_with_time += route.distance
      end
    end
    @likes = Rating.likes(@user.id)

    @following_routes = @user.following_routes.first(3)


  end


  def user_last_routes
    @user = User.find(params[:user_id])
    if params[:last_route_type] == "added"
      @routes = Route.find_all_by_user_id @user.id, :order => "created_at DESC", :limit => 6
      render :partial => 'last_routes_added'

    elsif params[:last_route_type] == "favorite"
      
      @favorite_routes = []
      @likes = Rating.likes(@user.id)
      @likes.each do |rat|
        @favorite_routes.push rat.route
      end
      render :partial => 'last_routes_favorite'

    elsif params[:last_route_type] == "following"
      @following_routes = @user.following_routes.first(3)
      render :partial => 'last_routes_following'
    end 
  end

  def routes
    @user = User.find(params[:id])
    @title_header_top = "Wszystkie trasy"
    @title_header = @user.username.to_s
    
    @routes = @user.routes.order('created_at DESC')
  end

  def favorite_routes
    @user = User.find(params[:id])
    @title_header_top = "Ulubione trasy"
    @title_header = @user.username.to_s
    @routes = []
    @likes = Rating.likes(@user.id)
    @likes.each do |rat|
      @routes.push rat.route
    end
  end

  def following
    @user = User.find(params[:id])
    @title_header_top = "Obserwowani"
    @title_header = "przez #{@user.username.to_s}"
    @users = @user.following.all
  end

  def following_routes
    # wszystie trasy obserwowanych uzytkownikow @routes
    @user = User.find(params[:id])
    @routes = []
    @user.following.each do |followed|
      followed.routes.each do |route|
        @routes.push route
      end
    end

  end

  def followers
    @user = User.find(params[:id])
    @title_header_top = "Followers"
    @title_header = @user.username.to_s
    @users = @user.followers.all
  end
  
  def stats
    @user = User.find(params[:id])
    @routes = @user.routes.order('created_at ASC')
    @days_since_first = (Time.now.to_date - @routes.first.created_at.to_date).to_i + 1

    @total_routes = Array.new
    @total_distance = Array.new
    @total_time = Array.new
    
    @days_since_first.times {@total_routes.push(0) }
    @days_since_first.times {@total_distance.push(0) }
    @days_since_first.times {@total_time.push(0) }


    @routes.each do |route|
      @days_since_first.times do |i|
        if route.created_at.to_date == i.days.ago.to_date
          @total_routes[i] += 1
          @total_distance[i] += route.distance
          @total_time[i] += route.total_time
        end
      end
    end

    # @routes.each do |route|
    #   @days_since_first.times do |i|
    #     if route.created_at.month == i.month.ago.month
    #       @total_routes[i] += 1
    #       @total_distance[i] += route.distance
    #       @total_time[i] += route.total_time
    #     end
    #   end
    # end

    # @routes.each do |route|
    #   @days_since_first.times do |i|
    #     if route.created_at.beginning_of_week == i.week.ago.beginning_of_week
    #       @total_routes[i] += 1
    #       @total_distance[i] += route.distance
    #       @total_time[i] += route.total_time
    #     end
    #   end
    # end




  end


  def new
    @title_header_top = "Rejestracja w"
    @title_header = "76rowerow.pl"
    @user = User.new
  end
  
  def create
    @user = User.new(params[:user])
    if @user.save
      sign_in @user
      flash[:success] = "Witaj w serwisie"
      redirect_to user_path(@user)
    else
      render 'new'
    end
  end
  
  def edit
    @user = User.find(params[:id])
    @title_header_top = "Edytuj profil"
    @title_header = @user.username.to_s
  end

  def edit_password
    @user = User.find(params[:id])
    @title_header_top = "Zmien haslo"
    @title_header = @user.username.to_s
  end
  
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      flash[:success] = "Dane zostaly zaktualizowane"
      # redirect_to @user
      render 'edit'
    else
      render 'edit'
    end
  end
  
  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "Uzytkownik zostal usuniety"
    redirect_to users_path
    
  end
  
  private
    
    def correct_user
      @user = User.find(params[:id])
      redirect_to root_path unless correct_user?
    end
    
    def admin_user
      @user = User.find(params[:id])
      redirect_to root_path unless (current_user.admin? && current_user != @user) 
    end

    def sort_column
      %w[username place total_distance total_routes created_at].include?(params[:sort]) ? params[:sort] : "created_at"
    end
    
    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
    end

end
