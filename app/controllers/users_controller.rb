class UsersController < ApplicationController
  
  before_filter :authenticate, :only => [:edit, :update]
  before_filter :correct_user, :only => [:edit, :update]
  before_filter :admin_user,   :only => :destroy

  helper_method :sort_column, :sort_direction

  def avatar
    @user = User.find(params[:id])
    send_data(@user.avatar_data,
              :filename => @user.avatar_name,
              :type => @user.avatar_content_type,
              :disposition => "inline"
              )
  end
  
  def index
    # @users = User.paginate(:page => params[:page], :per_page => 20)
    @title_header = "Uzytkownicy"
    @users = User.search(params[:search]).order(sort_column + " " + sort_direction).paginate(:page => params[:page], :per_page => 20)
  end
  
  def show
    @user = User.find(params[:id])
    @title_header = "Profil"
    @routes_all = Route.user_routes(@user.id)
    @workouts_all = Workout.where(:user_id => @user.id)
    @routes = Route.last_three(@user.id)
    @routes = Route.find_all_by_user_id @user.id, :order => "created_at DESC", :limit => 3
    @workouts_total_distance = 0
    @total_time_sec = 0
    @workouts_all.each do |workout|
      @workouts_total_distance += workout.route.distance
      @total_time_sec += workout.total_time
    end
    @total_time = time_to_string(@total_time_sec)
    @likes = Rating.likes(@user.id)

    @following_routes = @user.following_routes.first(3)
  end

  def user_last_routes
    @user = User.find(params[:user_id])
    if params[:last_route_type] == "added"
      @routes = Route.find_all_by_user_id @user.id, :order => "created_at DESC", :limit => 3
      render :partial => 'last_routes_added'
    elsif params[:last_route_type] == "favorite"
      @favorite_routes = []
      @likes = Rating.likes(@user.id).limit(3)
      @likes.each do |rat|
        @favorite_routes.push rat.route
      end
      render :partial => 'last_routes_favorite'
    elsif params[:last_route_type] == "following"
      @following_routes = @user.following_routes.first(3)
      render :partial => 'last_routes_following'
    end 
  end

  def workouts
    @user = User.find(params[:id])
    @workouts = @user.workouts.order('created_at DESC')
  end

  def routes
    @user = User.find(params[:id])
    @routes = @user.routes.search(params[:search]).order(sort_column + " " + sort_direction)
  end

  def favorite_routes
    @user = User.find(params[:id])
    @routes = []
    @likes = Rating.likes(@user.id)
    @likes.each do |rat|
      @routes.push rat.route
    end
    @routes
  end

  def following
    @user = User.find(params[:id])
    @users = @user.following.order(sort_column + " " + sort_direction)
  end

  def following_routes
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
    @users = @user.followers.order(sort_column + " " + sort_direction)
  end
  
  def show_stats
    @user = User.find(params[:user_id])
    @routes = @user.routes.order('created_at ASC')
    @total_routes   = Array.new
    @total_distance = Array.new
    # @total_time     = Array.new
    @total_climb_up = Array.new
    @offset = params[:offset].to_i
    @days_since_first = (Time.now.to_date - @routes.first.created_at.to_date).to_i + 1
    if params[:period] == "day"
      7.times {@total_routes.push(0) }
      7.times {@total_distance.push(0) }
      # 7.times {@total_time.push(0) }
      7.times {@total_climb_up.push(0) }
      @routes.each do |route|
        7.times do |i|
          if route.created_at.to_date == (i + @offset * 7).days.ago.to_date
            @total_routes[i] += 1
            @total_distance[i] += route.distance.round(2)
            # @total_time[i] += route.total_time
            @total_climb_up[i] += route.total_climb_up.round(2)
          end
        end
      end
      render :partial => 'stats_day'
    elsif params[:period] == "month"
      5.times {@total_routes.push(0) }
      5.times {@total_distance.push(0) }
      # 5.times {@total_time.push(0) }
      5.times {@total_climb_up.push(0) }
      @routes.each do |route|
        5.times do |i|
          if route.created_at.month == (i + @offset * 5).month.ago.month
            @total_routes[i] += 1
            @total_distance[i] += route.distance.round(2)
            # @total_time[i] += route.total_time
            @total_climb_up[i] += route.total_climb_up.round(2) if route.total_climb_up
          end
        end
      end
      render :partial => 'stats_month'
    elsif params[:period] == "week"
      5.times {@total_routes.push(0) }
      5.times {@total_distance.push(0) }
      # 5.times {@total_time.push(0) }
      5.times {@total_climb_up.push(0) }
      @routes.each do |route|
        5.times do |i|
          if route.created_at.beginning_of_week == (i + @offset * 5).week.ago.beginning_of_week
            @total_routes[i] += 1
            @total_distance[i] += route.distance.round(2)
            # @total_time[i] += route.total_time
            @total_climb_up[i] += route.total_climb_up.round(2) if route.total_climb_up
          end
        end
      end
      render :partial => 'stats_week'
    end
  end

  def stats
    @user = User.find(params[:id])
  end

  def new
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
  end

  def edit_password
    @user = User.find(params[:id])
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

  def show_all_routes
    @user = User.find(params[:user_id])
    render :json => @user.show_all_routes
  end
  
  private
  
    def time_to_string(total_time)
      if total_time
        h_time = (total_time / 3600 ).floor
        m_time = ((total_time - (h_time * 3600)) / 60).round
        "#{h_time}h #{m_time}m"
      end
    end
    
    def correct_user
      @user = User.find(params[:id])
      redirect_to root_path unless correct_user?
    end
    
    def admin_user
      @user = User.find(params[:id])
      redirect_to root_path unless (current_user.admin? && current_user != @user) 
    end

    def sort_column
      %w[title distance altitude max_altitude surface rating total_workouts total_comments total_likes username place total_distance total_routes total_workouts total_workouts_distance created_at].include?(params[:sort]) ? params[:sort] : "created_at"
    end
    
    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
    end
end
