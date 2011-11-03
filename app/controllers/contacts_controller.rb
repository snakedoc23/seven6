class ContactsController < ApplicationController
	def new
		@contact = Contact.new
		if current_user
			@contact.user = current_user.uesrname
			@contact.email = current_user.name
		end
	end
end
