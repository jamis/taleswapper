class CommentsController < ApplicationController
  before_action :find_commentable, only: %i[ create ]
  before_action :require_authentication

  def create
    @comment = @commentable.comments.create(comment_params.merge(user: Current.user))
  end

  private

  def find_commentable
    if params[:story_id]
      @commentable = Story.find(params[:story_id])
    elsif params[:chapter_id]
      @commentable = Chapter.find(params[:chapter_id])
    else
      raise ArgumentError, 'no commentable'
    end
  end

  def comment_params
    params.require(:comment).permit(:contents)
  end
end
