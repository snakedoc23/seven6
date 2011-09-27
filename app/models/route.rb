class Route < ActiveRecord::Base
  # attr_accessible :title, :description, :distance, :surface, :route_file
  attr_accessor :pulse, :time_string, :altitude, :pulse_edit, :time_string_edit
  belongs_to :user

  time_regex  = /\A\d{1,3}\D\d{1,2}\D?\d{0,2}\z/
  pulse_regex = /\A\d{2,3}\/\d{2,3}\z/

  validates :title,              :presence => true, 
                                 :length => { :minimum => 2 }
  validates :time_string,        :format => { :with => time_regex }, 
                                 :allow_blank => true
  validates :coordinates_string, :presence => true, 
                                 :length => { :minimum => 2, 
                                              :message => "Trasa musi zawierac co najmniej dwa punkty" }
  validates :pulse,              :format => { :with => pulse_regex, 
                                              :message => "Avg/Max" }, 
                                 :allow_blank => true



  before_save :split_pulse, :add_start_and_finish

  def self.search(search)
    if search
      where('title LIKE ?', "%#{search}%")
    else
      scoped
    end
  end

  def add_start_and_finish
    self.start_lat_lng = self.coordinates_string.split(",").first
    self.finish_lat_lng = self.coordinates_string.split(",").last
  end


  def altitude
    (self.max_altitude - self.min_altitude).round(2)
  end


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

  def pulse_edit
    "#{pulse_avg.round}/#{pulse_max.round}"
  end


  def split_pulse
    if pulse
      self.pulse_avg = self.pulse.split("/").first.to_f
      self.pulse_max = self.pulse.split("/").last.to_f
    end
  end



  def time_string_edit
    self.time_to_string
  end

  def time_to_string
    if total_time > 0
      h_time = (self.total_time / 3600 - 0.5).round
      m_time = ((self.total_time - h_time * 3600) / 60 - 0.5).round
      s_time = (self.total_time - h_time * 3600 - m_time * 60).round
      self.time_string = "#{h_time}h #{m_time}m #{s_time}s"
    end
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
#  max_speed          :float
#  start_lat_lng      :string(255)
#  finish_lat_lng     :string(255)
#

