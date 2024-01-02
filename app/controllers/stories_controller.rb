class StoriesController < ApplicationController
  before_action :find_story

  private

  def find_story
    @story = Story.find(params[:id])
  end
end
