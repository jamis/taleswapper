class OutlinesController < ApplicationController
  before_action :require_authentication
  before_action :find_chapter

  def update
    @chapter.outline.update!(outline_params)
    head :no_content
  end

  private

  def find_chapter
    @chapter = Chapter.find(params[:chapter_id])
    @story = Current.user.stories.find(@chapter.story_id)
  end

  def outline_params
    params.require(:outline).permit(:contents)
  end
end
