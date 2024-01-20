class ScratchPadsController < ApplicationController
  before_action :require_authentication
  before_action :find_chapter

  def update
    @chapter.scratch_pad.update!(scratch_pad_params)
    head :no_content
  end

  private

  def find_chapter
    @chapter = Chapter.find(params[:chapter_id])
    @story = Current.user.stories.find(@chapter.story_id)
  end

  def scratch_pad_params
    params.require(:scratch_pad).permit(:contents)
  end
end
