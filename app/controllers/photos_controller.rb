class PhotosController < ApplicationController
  def new
    @photo = Photo.new
    render :partial => 'new'
  end

  def create
    @photo = Photo.new(params[:photo])
    @photo.user_id = current_user.id
    if @photo.save
      flash[:success] = 'Zdjecie dodane'
      redirect_to route_path(params[:photo][:route_id])
    else
      flash[:error] = 'Zdjecie nie zostalo dodne'
      redirect_to route_path(params[:photo][:route_id])
    end
  end

  def markers
    route = Route.find(params[:route_id])
    markers = []
    route.photos.each do |photo|
      p = []
      p.push photo.id
      p.push photo.lat_lng
      markers.push p
    end
    render :json => markers
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
