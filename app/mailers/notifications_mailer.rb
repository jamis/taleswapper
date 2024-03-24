class NotificationsMailer < ApplicationMailer
  def comment_posted
    @comment = params[:comment]
    @creator = @comment.commentable.creator
    @commentable = @comment.commentable

    mail to: @creator.email_address,
         subject: "[Taleswapper] A new comment on your #{@commentable.class.name.downcase}: \"#{@commentable.title}\""
  end
end
