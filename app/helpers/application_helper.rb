module ApplicationHelper

	def user_avatar(user, size = "100x100")
    	if user.avatar?
      		image_tag user.avatar_url, :size => size, :alt => user.username
    	else
      		image_tag "/images/avatar-default.png", :size => size, :alt => user.username
    	end
	end
end
