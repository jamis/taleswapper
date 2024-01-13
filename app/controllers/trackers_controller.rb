class TrackersController < ApplicationController
  before_action :require_authentication
  before_action :find_story

  def index
  end

  private

  def find_story
    @story = Current.user.stories.find(params[:story_id])
  end
end
