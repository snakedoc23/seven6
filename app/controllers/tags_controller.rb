class TagsController < ApplicationController

  def index
    @user = User.find(params[:id])
    @tags = @user.tags
  end

  def show
    @tag = Tag.find(params[:id])
    @routes = @tag.routes
    @user = @tag.user
  end
  
end
