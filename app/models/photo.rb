class Photo < ActiveRecord::Base
  belongs_to :user
  belongs_to :route

  validates :title, :presence => true, :length => { :within => 2..150 }
  validates :description, :length => { :within => 1..400 }, :allow_blank => true
  validates :file_data, :presence => true
    
  def uploaded_photo=(photo_field)
    self.file_name = File.basename(photo_field.original_filename).gsub(/[^\w._-]/, '')
    self.file_data = photo_field.read
  end
end

# == Schema Information
#
# Table name: photos
#
#  id          :integer         not null, primary key
#  title       :string(255)
#  description :string(255)
#  lat_lng     :string(255)
#  file_name   :string(255)
#  file_data   :binary
#  user_id     :integer
#  route_id    :integer
#  altitude    :float
#  created_at  :datetime
#  updated_at  :datetime
#

