class User < ActiveRecord::Base
  attr_accessor :password
  attr_accessible :username, :email, :name, :age, :place, :gender, :password, :password_confirmation, :uploaded_avatar
  
  has_many :routes
  has_many :workouts, :dependent => :destroy
  has_many :comments, :dependent => :destroy
  has_many :ratings, :dependent => :destroy
  has_many :photos, :dependent => :destroy
  has_many :rated_routes, :through => :ratings, :source => :route, :dependent => :destroy
  has_many :relationships, :foreign_key => "follower_id", :dependent => :destroy
  has_many :following, :through => :relationships, :source => :followed
  has_many :reverse_relationships, :foreign_key => "followed_id", :class_name => "Relationship", :dependent => :destroy
  has_many :followers, :through => :reverse_relationships, :source => :follower
  has_many :tags

  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  
  validates :username,  :presence => { :message => "nie moze byc pusta" }, 
                        :length       => { :maximum => 50 },
                        :uniqueness   => true
  validates :email,     :presence     => true,
                        :format       => { :with => email_regex },
                        :uniqueness   => { :case_sensitive => false }
  validates :password,  :presence     => true,
                        :confirmation => true,
                        :length       => { :within => 4..40 }, :on => :create
  
  before_save :encrypt_password

  # scope :top_distance, lambda { order("total_distance DESC").limit(5) }
  # scope :top_routes, lambda { order("total_routes DESC").limit(5) }
  # wersja dla postgresql
  scope :top_distance, lambda { order("total_distance DESC NULLS LAST").limit(5) }
  scope :top_routes, lambda { order("total_routes DESC NULLS LAST").limit(5) }

  def show_all_routes
    reduced_array = Array.new
    routes.each { |route| reduced_array.push route.reduced_coordinates_string }
    reduced_array
  end

  def uploaded_avatar=(avatar_field)
    self.avatar_name = File.basename(avatar_field.original_filename).gsub(/[^\w._-]/, '')
    self.avatar_content_type = avatar_field.content_type.chomp
    self.avatar_data = avatar_field.read
  end

  def add_total_routes_and_distance
    self.total_routes = self.routes.count
    total = 0
    self.routes.each {|r| total += r.distance }
    self.total_distance = total.round
    self.save
  end

  def add_total_workouts
    self.total_workouts = self.workouts.count
    total_d = 0
    self.workouts.each { |w| total_d += w.route.distance }
    self.total_workouts_distance = total_d.round(2)
    self.save
  end

  def self.search(search)
    if search
      where('username LIKE ?', "%#{search}%")
    else
      scoped
    end
  end
  
  def correct_password?(submitted_password)
    self.encrypted_password == encrypt(submitted_password)
  end
  
  # authenticate zwraca usera jeśli dane są poprawne czyli haslo i username się zgadza, jeśli nie to nil
  def self.authenticate(username, submitted_password)
    user = find_by_username(username)
    user && user.correct_password?(submitted_password) ? user : nil
  end
  
  # authenticate_with_salt podobnie jak wyżeh tylko, że porównuje user.salt z pliku cookie wysłanego do przeglądrki
  def self.authenticate_with_salt(id, cookie_salt)
    user = find_by_id(id)
    (user && user.salt == cookie_salt) ? user : nil
  end

  def following?(followed)
    relationships.find_by_followed_id(followed)
  end

  def follow(followed)
    relationships.create!(:followed_id => followed.id)
  end

  def unfollow(followed)
    relationships.find_by_followed_id(followed).destroy
  end

  def following_routes
    @following_routes = []
    self.following.each do |followed|
      followed.routes.each do |route|
        @following_routes.push route
      end
    end
    @following_routes.sort! { |x,y| y.created_at <=> x.created_at }
  end
    
  private
    def encrypt_password
      if password 
        self.salt = make_salt if new_record?
        self.encrypted_password = encrypt(password)
      end
    end
    
    def encrypt(pass)
      secure_hash("#{self.salt}--#{pass}")
    end
    
    def make_salt
      secure_hash("#{Time.now}--#{self.password}")
    end
    
    def secure_hash(string)
      Digest::SHA2.hexdigest(string)
    end
end


# == Schema Information
#
# Table name: users
#
#  id                      :integer         not null, primary key
#  username                :string(255)
#  name                    :string(255)
#  email                   :string(255)
#  age                     :integer
#  place                   :string(255)
#  gender                  :boolean
#  created_at              :datetime
#  updated_at              :datetime
#  encrypted_password      :string(255)
#  salt                    :string(255)
#  admin                   :boolean
#  total_routes            :integer
#  total_distance          :integer
#  avatar_name             :string(255)
#  avatar_content_type     :string(255)
#  avatar_data             :binary
#  total_workouts          :integer
#  total_workouts_distance :float
#  total_workouts_time     :integer
#

