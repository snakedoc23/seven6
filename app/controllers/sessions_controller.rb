class SessionsController < ApplicationController
  
  def new
    @title_header_top = "Logowanie do"
    @title_header = "76rowerow.pl"
  end
  
  def create
    # Sprawdzenie czy podane parametry( username i password ) są prawidłowe jeśli tak to zaloguj jeśli nie to flash
    # Funkcja authenticate zwraca nil jeśli username i password się nie zgadzają 
    user = User.authenticate(params[:session][:username],
                             params[:session][:password])
    if user.nil?
      flash.now[:error] = "login lub haslo"
      render 'new'
    else
      # Zaloguj i przenieś na stronę profilu
      sign_in user
      redirect_back_or user
    end
  end
  
  def destroy
    sign_out
    redirect_to root_path
  end

end
