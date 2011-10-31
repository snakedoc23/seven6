class RouteFile < ActiveRecord::Base
  validates :data, :presence => true

  def uploaded_file=(route_field)
    self.name = File.basename(route_field.original_filename).gsub(/[^\w._-]/, '')
    self.content_type = route_field.content_type.chomp
    self.data = route_field.read
  end

  def string_from_kml
	  string = ""
    self.data.split("<coordinates>").each_with_index do |segment, index|
      unless index == 0
        segment.split("</coordinates>")[0].split(" ").each_with_index do |line, i|
          string += "#{line.split(",")[1]},#{line.split(",")[0]}|"
        end
      end
    end
    string.chop!
  end

end

# == Schema Information
#
# Table name: route_files
#
#  id           :integer         not null, primary key
#  name         :string(255)
#  content_type :string(255)
#  data         :binary
#  created_at   :datetime
#  updated_at   :datetime
#

