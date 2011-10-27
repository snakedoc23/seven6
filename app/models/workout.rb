class Workout < ActiveRecord::Base

  attr_accessor :pulse, :time_string

  belongs_to :user
  belongs_to :route

  time_regex  = /\A\d{1,3}\D\d{1,2}\D?\d{0,2}\z/
  pulse_regex = /\A\d{2,3}\/\d{2,3}\z/

  validates :time_string, :format => { :with => time_regex }, :allow_blank => true
  validates :pulse, :format => { :with => pulse_regex }, :allow_blank => true






  before_save :total_time_calculate, :split_pulse, :calculate_avg_speed

  def split_pulse
    if pulse
      self.pulse_avg = self.pulse.split("/").first.to_f
      self.pulse_max = self.pulse.split("/").last.to_f
    end
  end

  def time_to_string
    if total_time
      h_time = (self.total_time / 3600 ).floor
      m_time = ((self.total_time - (h_time * 3600)) / 60).floor
      s_time = (self.total_time - h_time * 3600 - m_time * 60).round
      "#{h_time}h #{m_time}m #{s_time}s"
    end
  end

  def total_time_calculate
    if time_string
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


  def calculate_avg_speed
    if total_time
      self.avg_speed = (self.route.distance * 3600 / self.total_time).round(2)
    end
  end

end

# == Schema Information
#
# Table name: workouts
#
#  id          :integer         not null, primary key
#  route_id    :string(255)
#  user_id     :string(255)
#  description :text
#  total_time  :float
#  avg_speed   :float
#  max_speed   :float
#  pulse_max   :float
#  pulse_avg   :float
#  temperature :float
#  created_at  :datetime
#  updated_at  :datetime
#

