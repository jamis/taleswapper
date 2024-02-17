class ScratchPadsController < ApplicationController
  before_action :require_authentication
  before_action :find_scratch_pad

  def update
    @scratch_pad.update!(scratch_pad_params)
    head :no_content
  end

  private

  def find_scratch_pad
    @scratch_pad = ScratchPad.find(params[:id])

    # make sure the scratch pad belongs to the user
    chapter = Current.user.stories.joins(:chapters)
                     .where(chapters: { id: @scratch_pad.chapter_id })
                     .first

    raise ActiveRecord::RecordNotFound unless chapter
  end

  def scratch_pad_params
    params.require(:scratch_pad).permit(:contents, :position)
  end
end
