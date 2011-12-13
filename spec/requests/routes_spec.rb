require 'spec_helper'

describe "Routes" do
  describe "GET /routes" do
    it "works! (now write some real specs)" do
      # Run the generator again with the --webrat flag if you want to use webrat methods/matchers
      get routes_path
      response.status.should be(200)
    end
  end

  describe "Tworzenie nowej trasy" do
    before do
      @user = Factory(:user)
    end
    it 'musi buc zalogowany' do
      visit root_path
      click_link "Dodaj "
      page.should have_content('Zaloguj')
      fill_in 'session_username', :with => 'test'
      fill_in 'session_password', :with => 'test123'
      click_button 'session_submit'
      current_path.should == new_route_path
      # page.should have_content('')
    end

  end

end
