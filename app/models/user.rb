class User < ActiveRecord::Base
  attr_accessor :password
  attr_accessible :username, :email, :name, :age, :place, :gender, :password, :password_confirmation, :avatar, :remote_avatar_url
  
  has_many :routes
  has_many :comments
  
  has_many :ratings
  has_many :rated_routes, :through => :ratings, :source => :route

  mount_uploader :avatar, AvatarUploader

  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  
  validates :username,  :presence     => true,
                        :length       => { :maximum => 50 },
                        :uniqueness   => true
  validates :email,     :presence     => true,
                        :format       => { :with => email_regex },
                        :uniqueness   => { :case_sensivite => false }
  validates :password,  :presence     => true,
                        :confirmation => true,
                        :length       => { :within => 4..40 }, :on => :create
  
  before_save :encrypt_password

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
#  id                 :integer         not null, primary key
#  username           :string(255)
#  name               :string(255)
#  email              :string(255)
#  age                :integer
#  place              :string(255)
#  gender             :boolean
#  created_at         :datetime
#  updated_at         :datetime
#  encrypted_password :string(255)
#  salt               :string(255)
#  admin              :boolean
#  avatar             :string(255)
#

