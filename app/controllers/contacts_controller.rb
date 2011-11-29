class ContactsController < ApplicationController
	def new
    @title_header = "Kontakt"
		@contact = Contact.new
		if current_user
			@contact.name = current_user.username
			@contact.email = current_user.email
		end
	end

  def create
    @contact = Contact.new(params[:contact])
    if @contact.save
      flash[:success] = "Wiadomosc zostala wyslana"
      redirect_to root_path
    else
      render 'new'
    end
  end
end
