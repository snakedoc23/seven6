module ApplicationHelper

	def is_selected?(page)
		"selected" if current_page? page
	end

	def user_avatar(user, size = "100x100")
		if user.avatar_name
			image_tag (url_for(:controller => :users, :action => :avatar, :id => user.id)), :size => size, :alt => user.username
		else
			image_tag "/images/avatar-default.png", :size => size, :alt => user.username
		end
	end

	def sortable(title, column)
		css_class = column == sort_column ? "sort-#{sort_direction}" : nil
		direction = column == sort_column && sort_direction == "desc" ? "asc" : "desc"
		link_to title, params.merge(:sort => column, :direction => direction, :page => nil), {:class => css_class}
	end

	def time_to_string(total_time)
    if total_time > 0
      h_time = (total_time / 3600).floor
      m_time = ((total_time - h_time * 3600) / 60).floor
      s_time = (total_time - h_time * 3600 - m_time * 60).round
      time_string = "#{h_time}h #{m_time}m #{s_time}s"
    end
  end

  def top_users
    User.top_distance
  end
  def top_users_routes
    User.top_routes
  end
end
