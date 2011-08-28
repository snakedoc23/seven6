class UsersController < ApplicationController
  
  before_filter :authenticate, :only => [:edit, :update]
  before_filter :correct_user, :only => [:edit, :update]
  
  def index
    @users = User.paginate(:page => params[:page], :per_page => 20)
    @title_header = "Uzytkownicy"
  end
  
  def show
    @user = User.find(params[:id])
    @title_header = "Profil #{@user.username}"
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
  
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      flash[:success] = "Dane zostaly zaktualizowane"
      redirect_to @user
    else
      render 'edit'
    end
  end
  
  private
    def authenticate
      deny_access unless signed_in?
    end
    
    def correct_user
      @user = User.find(params[:id])
      redirect_to root_path unless correct_user?
    end

end
