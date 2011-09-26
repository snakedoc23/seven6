module PagesHelper
	def profile_image(route)
		altitude = (route.max_altitude - route.min_altitude).round(2)
		if altitude < 70 
			"green"
		elsif altitude >= 70 && altitude < 120
			"yellow"
		elsif altitude >= 120 && altitude < 200
			"orange"
		elsif altitude >= 200
			"red"
		end
	end
end
