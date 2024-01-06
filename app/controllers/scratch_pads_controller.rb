class ScratchPadsController < ApplicationController
  before_action :require_authentication
  before_action :find_story

  def update
    @story.scratch_pad.update!(scratch_pad_params)
    head :no_content
  end

  private

  def find_story
    @story = Current.user.stories.find(params[:story_id])
  end

  def scratch_pad_params
    params.require(:scratch_pad).permit(:contents)
  end
end
