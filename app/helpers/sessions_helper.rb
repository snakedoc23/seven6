module SessionsHelper
  
  def sign_in(user)
    cookies.permanent.signed[:remember_token] = [user.id, user.salt] # Stworzenie przez Rails cookie remember_token z wykorzystaniem user.id i salt w celu poprawy bezpieczeństwa 
    current_user = user # Zalogowany user ląduje do zmiennej current_user, króra jest dostępna we wszystkich controllerach i widokach
  end
  
  def current_user=(user)
    @current_user = user
  end
  
  def current_user
    @current_user ||= user_from_remember_token # Jeśli @curent_user jest nil to przypisz mu wartość z user_from_remember_token czli nowo zalogowanego usera, jeśli coś tam jest to pozostaw
  end
  
  def signed_in?
    !current_user.nil? 
  end
  
  def sign_out
    cookies.delete(:remember_token)
    current_user = nil
  end
  
  def deny_access
    store_location # Przechowuje sciezke do ktorej uzytkownik probowal sie dostac
    redirect_to signin_path, :notice => "Zaloguj sie by uzyskac dostep do tej strony"
  end
  
  def redirect_back_or(default)
    redirect_to (session[:return_to] || default)
    clear_return_to
  end
  
  def correct_user?
    current_user == @user
  end

  def authenticate
    deny_access unless signed_in?
  end
  
  private
  
    def user_from_remember_token
      User.authenticate_with_salt(*remember_token) # * - przesłanie do funkcji tabeli z dwoma elementami jako dwa parametry
    end
    
    def remember_token
      cookies.signed[:remember_token] || [nil, nil] # Zwraca [user.id, user.salt] lub dwa nile
    end
    
    def store_location
      session[:return_to] = request.fullpath
    end
    
    def clear_return_to
      session[:return_to] = nil
    end
    
end
