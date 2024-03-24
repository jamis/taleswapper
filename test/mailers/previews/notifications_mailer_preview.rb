# Preview all emails at http://localhost:3000/rails/mailers/notifications_mailer
class NotificationsMailerPreview < ActionMailer::Preview
  def comment_posted
    comment = Comment.where(commentable_type: (params[:mode] || 'chapter').classify).first
    NotificationsMailer.with(comment: comment).comment_posted
  end
end
