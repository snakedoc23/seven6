class Route < ActiveRecord::Base
	# attr_accessible :title, :description, :distance, :surface, :route_file
	attr_accessor :pulse, :time_string
	belongs_to :user



	time_regex = /\A\d{1,3}[\D]\d{1,2}\D{1}\d{1,2}\z/

	validates :time_string, 		:format => { :with => time_regex }
	validates :coordinates_string, 	:presence => true,
									:length => { :minimum => 2 }

	before_save :total_time_calculate


	def total_time_calculate
		time_s = ""
		self.time_string.each_char do |char|
			if char.match(/\D/)
				time_s += ":"
			else
				time_s += char
			end 
		end
		time_a = time_s.split(":")
		self.total_time = time_a[0].to_i  * 3600 + time_a[1].to_i * 60 + time_a[2].to_i
	end
end



# == Schema Information
#
# Table name: routes
#
#  id                 :integer         not null, primary key
#  title              :string(255)
#  description        :text
#  distance           :float
#  surface            :string(255)
#  route_file         :string(255)
#  user_id            :integer
#  created_at         :datetime
#  updated_at         :datetime
#  coordinates_string :text
#  min_altitude       :float
#  max_altitude       :float
#  total_climb_up     :float
#  total_climb_down   :float
#  avg_speed          :float
#  total_time         :float
#  rating             :float
#  pulse_max          :float
#  pulse_avg          :float
#  temperature        :float
#

