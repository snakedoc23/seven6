module ApplicationHelper

	def is_selected?(page)
		"selected" if current_page? page
	end

	def user_avatar(user, size = "100x100")
		if user.avatar?
			image_tag user.avatar_url, :size => size, :alt => user.username
		else
			image_tag "/images/avatar-default.png", :size => size, :alt => user.username
		end
	end

	def sortable(title, column)
		css_class = column == sort_column ? "sort-#{sort_direction}" : nil
		direction = column == sort_column && sort_direction == "desc" ? "asc" : "desc"
		link_to title, params.merge(:sort => column, :direction => direction, :page => nil), {:class => css_class}
	end

end
