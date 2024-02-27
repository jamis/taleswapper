class StoriesController < ApplicationController
  before_action :find_story, only: %i[ show edit update ]
  before_action :require_authentication, only: %i[ new create ]

  def new
    @story = Story.new(title: "Untitled")
  end

  def create
    @story = Current.user.stories.create!(story_params)
    redirect_to @story
  end

  def update
    @story.update!(story_params)
    redirect_to @story
  end

  private

  def find_story
    @story = Story.find(params[:id])
  end

  def story_params
    params.require(:story).permit(:title, :subtitle, :description)
  end
end
