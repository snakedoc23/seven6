class PhotosController < ApplicationController
  def new
    @photo = Photo.new
    render :partial => 'new'
  end

  def create
    @photo = Photo.new(params[:photo])
    # @photo.title = params[:title]
    # @photo.description = params[:description] if params[:description] != ""
    # @photo.lat_lng = params[:lat_lng] if params[:lat_lng] != ""
    # @photo.altitude = params[:altitude] if params[:altitude] != ""
    # @photo.user_id = current_user.id
    # @photo.route_id = params[:route_id]
    if @photo.save
      # render :partial => 'show'
      render :text => params.inspect
    else
      render :partial => 'new'
    end
  end

  def show
    @photo = Photo.find(params[:id])
    render :partial => 'show'
  end

  def photo_file
    @photo = Photo.find(params[:id])
    send_data(@photo.file_data,
              :filename => @photo.file_name,
              :type => "image/png" ,
              :disposition => "inline"
              )
  end

end
