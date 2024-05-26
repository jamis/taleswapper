class NotificationsMailer < ApplicationMailer
  helper :application

  def comment_posted
    @comment = params[:comment]
    @creator = @comment.commentable.creator
    @commentable = @comment.commentable

    mail to: @creator.email_address,
         subject: "[Taleswapper] A new comment on your #{@commentable.class.name.downcase}: \"#{@commentable.title}\""
  end

  def new_subscription
    @subscription = params[:subscription]
    @subscribable = @subscription.subscribable
    @subscriber = @subscription.user
    @creator = @subscribable.is_a?(User) ? @subscribable : @subscribable.creator

    subject = if @subscribable.is_a?(User)
                "[Taleswapper] You have a new subscriber!"
              else
                "[Taleswapper] You have a new subscriber to \"#{@subscribable.title}\""
              end

    mail to: @creator.email_address, subject: subject
  end

  def new_chapter
    @chapter = params[:chapter]
    @subscriber = params[:subscriber]
    @story = @chapter.story
    @creator = @story.creator

    subject = "[Taleswapper] A new chapter of \"#{@story.title}\" is available to read"

    mail to: @subscriber.email_address, subject: subject
  end

  def new_story
    @story = params[:story]
    @chapter = @story.start_chapter || @story.setup_chapter

    if @chapter.nil? || !@chapter.published?
      raise ArgumentError, 'cannot notify if story has no first chapter'
    end

    @subscriber = params[:subscriber]
    @creator = @story.creator

    subject = "[Taleswapper] A new story from #{@creator.display_name} is available to read"

    mail to: @subscriber.email_address, subject: subject
  end
end
