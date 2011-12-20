class TagsController < ApplicationController

  def index
    @user = User.find(params[:id])
    @tags = @user.tags
  end

  def show
    @tag = Tag.find(params[:id])
    @routes = @tag.routes
    @user = @tag.user

    @distance = 0;
    @tag.routes.each do |route|
      @distance += route.distance
    end
  end
  
end
