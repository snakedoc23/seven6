class PagesController < ApplicationController
  def home
    @title_header = "Najnowsze trasy"
    @routes = Route.all :order => "created_at DESC", :limit => 5
  end

end
