class CommentsController < ApplicationController

	def create
		@route = Route.find(params[:route_id])
		@content = params[:content]
		@comment = Comment.new
		@comment.content = @content
		@comment.user_id = current_user.id
		@comment.route_id = @route.id
		if @comment.save
			# render :text => "#{@comment.user.username} add comment: #{@comment.content}"
			render :partial => 'comment'
		else
			redner :text => "nie zapisalo sie"
		end
	end

	def edit
		@comment = Comment.find(params[:comment_id])
		@comment.content = params[:content]
		if @comment.save
			render :text => "OK"
		else
			render :text => "NOK"
		end
		
		
	end

end
