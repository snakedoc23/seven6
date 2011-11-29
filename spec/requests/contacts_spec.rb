require 'spec_helper'

describe "Contacts" do
  it "wysyla wiadomosc" do
    visit root_path
    click_link 'Kontakt'
    page.should have_content('Kontakt')
    fill_in 'contact_name', :with => 'Test'
    fill_in 'contact_email', :with => 'test@example.com'
    fill_in 'contact_content', :with => 'test@example.com'
    click_button 'contact_submit'
    page.should have_content('Wiadomosc zostala wyslana')
    current_path.should == root_path
  end
end
