class SequelsController < ApplicationController
  before_action :require_authentication
  before_action :find_scope

  def new
    @uuid = params[:uuid] || SecureRandom.uuid
  end

  def create
    @new_chapter = @story.chapters.create_sequel(chapter_sequel_params)

    flash[:stale_uuid] = @new_chapter.uuid
    flash[:parent_key] = helpers.dom_id(@chapter || @story)

    redirect_to edit_chapter_url(@new_chapter)
  end

  private

  def find_scope
    if params[:chapter_id]
      @chapter = Chapter.find(params[:chapter_id])
      @story = Current.user.stories.find(@chapter.story_id)
    elsif params[:story_id]
      @story = Current.user.stories.find(params[:story_id])
    else
      raise ArgumentError, "must have a chapter or a story"
    end
  end

  def chapter_sequel_params
    params
      .require(:chapter_sequel)
      .permit(:uuid, :contents, :story_notes)
      .merge(prequel: @chapter)
  end
end
