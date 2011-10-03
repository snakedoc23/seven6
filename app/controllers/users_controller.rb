class UsersController < ApplicationController
  
  before_filter :authenticate, :only => [:edit, :update]
  before_filter :correct_user, :only => [:edit, :update]
  before_filter :admin_user,   :only => :destroy
  
  def index
    # @users = User.paginate(:page => params[:page], :per_page => 20)
    @title_header = "Uzytkownicy"
    @users = User.search(params[:search]).paginate(:page => params[:page], :per_page => 20)

  end
  
  def show
    @user = User.find(params[:id])
    @title_header = "Profil #{@user.username}"
    @routes_all = Route.user_routes(@user.id)
    @routes = Route.last_three(@user.id)
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
  end

  def routes
    @user = User.find(params[:id])
    @routes = Route.user_routes(@user.id)
  end

  def favorite_routes
    @user = User.find(params[:id])
    @routes = []
    @likes = Rating.likes(@user.id)
    @likes.each do |rat|
      @routes.push rat.route
    end
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

end
