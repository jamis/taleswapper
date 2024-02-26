class TrackSheetsController < ApplicationController
  before_action :require_authentication
  before_action :find_chapter

  private

  def find_chapter
    @chapter = Chapter.find(params[:chapter_id])
    @track_sheet = @chapter.track_sheet

    # make sure the chapter belongs to the user
    Current.user.stories.find(@chapter.story_id)
  end
end
