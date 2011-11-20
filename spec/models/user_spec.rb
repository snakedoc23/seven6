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


end