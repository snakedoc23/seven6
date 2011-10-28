class Route < ActiveRecord::Base
  # attr_accessible :title, :description, :distance, :surface
  attr_accessor :pulse, :time_string, :altitude, :pulse_edit, :time_string_edit, :total_time, :max_speed, :avg_speed, :pulse_avg, :pulse_max, :temperature
  
  belongs_to :user
  has_many :workouts, :dependent => :destroy
  has_many :comments, :dependent => :destroy
  has_many :ratings, :dependent => :destroy
  has_many :raters, :through => :ratings, :source => :user, :dependent => :destroy

  # mount_uploader :static_map, StaticMapUploader
  # mount_uploader :route_file, RouteFileUploader

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
  after_save :add_total_distance_and_total_routes_to_user, :add_workout

  # default_scope :order => 'created_at DESC'

  scope :user_routes, lambda {|id| find_all_by_user_id(id, :order => "created_at DESC") }
  scope :last_three, lambda {|id| find_all_by_user_id(id, :order => "created_at DESC", :limit => 3) }

  def add_total_workouts
    self.total_workouts = self.workouts.count
    self.save
  end

  def add_workout
    if self.total_time.to_f > 0
      workout = self.workouts.new
      workout.user_id = self.user_id
      workout.total_time = self.total_time
      workout.max_speed = self.max_speed
      workout.pulse_max = self.pulse_max
      workout.pulse_avg = self.pulse_avg
      workout.temperature = self.temperature
      workout.save
    end
  end

  # kartegorie podjazdow na trasie
  def climbs
    if self.climbs_string

      # "72487,100.1278839111328,85801,147.2848510742188|201190,99.21577453613281,202669,131.0301055908203"
      climbs_array = []
      self.climbs_string.split("|").each do |climb|
        climb_array = climb.split(",")
        start_pos = climb_array[0]
        start_el = climb_array[1]
        end_pos = climb_array[2]
        end_el = climb_array[3]

        length = end_pos.to_f - start_pos.to_f
        grade = ((end_el.to_f - start_el.to_f) * 100 / length).round(1)
        
        climbs_array.push Hash[ :grade, grade, :length, length, :start_pos, start_pos.to_f, :start_el, start_el.to_f.round(1), :end_pos, end_pos.to_f, :end_el, end_el.to_f.round(1) ]
      end
      climbs_array
    end
  end

  def add_total_distance_and_total_routes_to_user
    self.user.add_total_routes_and_distance
  end

  def self.search(search)
    if search
      where('title LIKE ?', "%#{search}%")
    else
      scoped
    end
  end

  def add_start_and_finish
    self.start_lat_lng = self.coordinates_string.split("|").first
    self.finish_lat_lng = self.coordinates_string.split("|").last
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
    if total_time
      h_time = (self.total_time / 3600 ).floor
      m_time = ((self.total_time - (h_time * 3600)) / 60).floor
      s_time = (self.total_time - h_time * 3600 - m_time * 60).round
      self.time_string = "#{h_time}h #{m_time}m #{s_time}s"
    end
  end

  def avg_rating
    sum = 0
    total = 0
    self.ratings.each do |rat|
      if !rat.value.nil?
        sum += rat.value
        total += 1
      end
    end
    self.rating = sum.to_f / total.to_f
  end

  # Static Google Maps + redukcja punktow i samych wspolzednych
  def create_static_map
    path_array = coordinates_string.split("|")

    while path_array.length > 70
      path_array = reductionPath(path_array)
    end

    coordinates_string_temp = ""

    path_array.each do |pos|
      # pos_array = pos.split(",")
      # lat = pos_array[0].to_f.round(6).to_s
      # lng = pos_array[1].to_f.round(6).to_s

      # coordinates_string_temp += "|#{lat},#{lng}"
      coordinates_string_temp += "|#{pos}"
    end

    "http://maps.googleapis.com/maps/api/staticmap?path=color:0xc84446ff|weight:2#{coordinates_string_temp}&size=79x79&sensor=false"
  end

  def save_static_map
    self.remote_static_map_url= self.create_static_map
  end

  def reduced_coordinates_string
    path_array = coordinates_string.split("|")

    while path_array.length > 70
      path_array = reductionPath(path_array)
    end

    coordinates_string_temp = ""
    path_array.each do |pos|
      if coordinates_string_temp == ""
        coordinates_string_temp += "#{pos}"
      else
        coordinates_string_temp += "|#{pos}"
      end
    end
    coordinates_string_temp
  end

  private
    def reductionPath(path) #Redukcja tablicy by wyslac do google (patrz application.js)
      path_length = path.length

      x = (path_length.to_f / (path_length.to_f - 70)).ceil
      reucedPath = [];

      path_length.times do |i|
        if ((i + 1) % x != 0)
          reucedPath.push(path[i])
        end
      end
      reucedPath
    end

end




# == Schema Information
#
# Table name: routes
#
#  id                      :integer         not null, primary key
#  title                   :string(255)
#  description             :text
#  distance                :float
#  surface                 :string(255)
#  user_id                 :integer
#  created_at              :datetime
#  updated_at              :datetime
#  coordinates_string      :text
#  min_altitude            :float
#  max_altitude            :float
#  total_climb_up          :float
#  total_climb_down        :float
#  rating                  :float
#  start_lat_lng           :string(255)
#  finish_lat_lng          :string(255)
#  static_map_name         :string(255)
#  static_map_content_type :string(255)
#  static_map_data         :binary
#  climbs_string           :string(255)
#

