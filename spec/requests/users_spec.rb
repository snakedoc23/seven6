require 'spec_helper'

describe "Users" do
  describe "GET /users" do
    it "works! (now write some real specs)" do
      # Run the generator again with the --webrat flag if you want to use webrat methods/matchers
      get users_path
      response.status.should be(200)
    end
  end


  # describe 'Rejestracja' do
  #   it 'tworzy nowego uzytkownika' do
  #     lambda do
  #       visit root_path
  #       click_link 'Zaloguj'
  #       click_link 'signup_link'
  #       page.should have_content('Rejestracja')
  #       fill_in 'user_username', :with => 'test'
  #       fill_in 'user_email', :with => 'test@test.pl'
  #       fill_in 'user_password', :with => 'test'
  #       fill_in 'user_password_confirmation', :with => 'test'
  #       click_button 'user_submit'
  #       page.should have_content('Profil test')
  #     end.should change(User, :count).by(1)
  #   end
  # end


end
