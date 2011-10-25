class RouteFile < ActiveRecord::Base
  validates :data, :presence => true

  def uploaded_file=(route_field)
    self.name = File.basename(route_field.original_filename).gsub(/[^\w._-]/, '')
    self.content_type = route_field.content_type.chomp
    self.data = route_field.read
  end
end
