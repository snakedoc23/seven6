require 'spec_helper'

describe 'User' do
  before(:each) do
    @user = User.new(
      :username => 'test',
      :email => 'test@example.com',
      :password => 'test123',
      :password_confirmation => 'test123'
    )
  end

  it 'tworzy nowego uzytkownika' do
    @user.save
  end
  it 'wymaga nazwy' do
    @user.username = ''
    @user.should_not be_valid
  end
  it 'nzawa nie moze sie powtarzac' do
    @user.save
    user2 = User.new(
      :username => 'test',
      :email => 'test2@example.com',
      :password => 'test123',
      :password_confirmation => 'test123'
    )
    user2.should_not be_valid
  end
  it 'nazwa nie moze byc dluzsza niz 50 znakow' do
    @user.should be_valid
    @user.username = 'x' * 51
    @user.should_not be_valid
  end
  it 'wymagany email' do
    @user.email = ''
    @user.should_not be_valid
  end
  it 'poprawny email' do
    addresses = %w[user@ex.com USER@GOOGLE.COM.PL foo.bar.baz@gmail.com]
    addresses.each do |address|
      @user.email = address
      @user.should be_valid
    end
  end
  it 'niepoprawny email' do
    addresses = %w[user@ex,com google.com foo.bar.baz@gmail goo@pl]
    addresses.each do |address|
      @user.email = address
      @user.should_not be_valid
    end
  end
  it 'email nie moze sie powtarzac' do
    @user.save
    user2 = User.new(
      :username => 'test2',
      :email => 'test@example.com',
      :password => 'test123',
      :password_confirmation => 'test123'
    )
    user2.should_not be_valid
  end
  it 'email nie moze sie powtarzac (UPCASE)' do
    @user.save
    user2 = User.new(
      :username => 'test2',
      :email => 'test@example.com',
      :password => 'test123',
      :password_confirmation => 'test123'
    )
    user2.email = 'TEST@example.com'
    user2.should_not be_valid
  end
  it 'posiada password i password_confirmation' do
    @user.should respond_to(:password)
    @user.should respond_to(:password_confirmation)
  end
  it 'wymaga hasla' do
    @user.should be_valid
    @user.password = ''
    @user.password_confirmation = ''
    @user.should_not be_valid
  end
  it 'haslo musi sie zgadzac z potwierdzeniem' do
    @user.should be_valid
    @user.password_confirmation = 'test321'
    @user.should_not be_valid
  end
  it 'dlugosc hasla przynajmniej 4 znaki' do
    @user.should be_valid
    @user.password = '123'
    @user.password_confirmation = '123'
    @user.should_not be_valid
  end
  it 'dlugosc hasla najwyzej 40 znakow' do
    @user.should be_valid
    @user.password = 'x' * 41
    @user.password_confirmation = 'x' * 41
    @user.should_not be_valid
  end

  it 'posiada nie pusty encrypted_password' do
    @user.save
    @user.encrypted_password.should_not be_blank
  end
  it 'posiada nie pusty salt' do
    @user.save
    @user.salt.should_not be_blank
  end
  it 'posiada metode correct_password?' do
    @user.save
    @user.should respond_to(:correct_password?)
  end

  it 'correct_password? zwraca true jesli hasla pasuja' do
    @user.save
    @user.correct_password?('test123').should be_true
  end
  it 'correct_password? zwraca false jesli hasla nie pasuja' do
    @user.save
    @user.correct_password?('test1234').should be_false
  end
  describe 'logowanie' do
    before do
      @user.save
    end
    it 'metoda authenticate' do
      User.should respond_to(:authenticate)
    end
    it 'user zapisany w bazie' do
      User.find(@user).should == @user
    end
    it 'authenticate zwraca nil gdy nie ma takie usera w bazie' do
      User.authenticate('test2', 'test123').should be_nil
    end
    it 'authenticate zwraca nil gdy haslo jest niewlasciwe' do
      User.authenticate('test', 'test12').should be_nil
    end
    it 'authenticate poprawnie loguje uzytkownika' do
      User.authenticate('test', 'test123').should == @user
    end

  end

  describe 'wyszukiwanie' do
    before(:each) do
      @u1 = Factory(:user)
      @u2 = Factory(:user, :username => 'test2' ,:email => "test2@example.com")

    end
    it 'zwraca tylko wyszukiwanego uzytkownika' do
      result = User.search("test2")
      result.should == [@u2]
    end
    it 'zwraca tablice z dwaoma uzytkownikami' do
      result = User.search("test")
      result.should be_include(@u1) && be_include(@u2)
    end

  end

  describe 'obserwowanie' do
    before(:each) do
      @u1 = Factory(:user)
      @u2 = Factory(:user, :username => 'test2' ,:email => "test2@example.com")
    end
    it 'metoda follow' do
      @u1.should respond_to(:follow)
    end
    it 'dodaje do obserwowanych' do
      @u1.follow(@u2)
      @u1.following.size.should == 1
    end
    it 'jest obserwowany' do
      @u1.follow(@u2)
      @u2.followers.size.should == 1
    end
    it 'metoda following?' do
      @u1.follow(@u2)
      @u1.following?(@u2).should be_true
      @u2.following?(@u1).should be_false
    end
    it 'przestaje obserwowac' do
      @u1.follow(@u2)
      @u1.following?(@u2).should be_true
      @u1.unfollow(@u2)
      @u1.following?(@u2).should be_false
      @u1.following.size.should == 0
      @u2.followers.size.should == 0
    end
  end

  describe 'trasy' do
    before(:each) do
      @user = Factory(:user)
      @route = Factory(:route, :user => @user)
    end
    it 'posiada trase' do
      @user.routes.size.should == 1
    end
    it 'total_routes' do
      @user.total_routes.should == 1
    end
    it 'total_routes' do
      @user.total_distance.should == 3
    end
    it 'pokaz wszystkie trasy' do
      @user.show_all_routes.should == ["40.808291,-74.025858|40.806212,-74.0147|40.798675,-74.014357|40.789708,-74.017104"]
    end
  end

  describe 'przejazdy' do
    
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

