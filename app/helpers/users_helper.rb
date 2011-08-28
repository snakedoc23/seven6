module UsersHelper
  
  def user_avatar(user, size = "100x100")
    if user.avatar_url
      image_tag "/assets/avatar-#{user.id}.jpg", :size => size, :alt => user.username
    else
      image_tag "/assets/avatar-default.png", :size => size, :alt => user.username
    end
  end
  
end
