# Preview all emails at http://localhost:3000/rails/mailers/notifications_mailer
class NotificationsMailerPreview < ActionMailer::Preview
  def comment_posted
    comment = Comment.where(commentable_type: (params[:mode] || 'chapter').classify).first
    NotificationsMailer.with(comment: comment).comment_posted
  end

  def new_subscription
    subscription = Subscription.where(subscribable_type: (params[:mode] || 'story').classify).first
    NotificationsMailer.with(subscription: subscription).new_subscription
  end

  def new_chapter
    subscriber = User.first
    chapter = Chapter.first
    NotificationsMailer.with(subscriber: subscriber, chapter: chapter).new_chapter
  end

  def new_story
    subscriber = User.first
    story = Story.first
    NotificationsMailer.with(subscriber: subscriber, story: story).new_story
  end
end
