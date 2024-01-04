class StoriesController < ApplicationController
  before_action :find_story, only: %i[ show ]
  before_action :set_initial_chapter, only: %i[ show ]
  before_action :require_authentication, only: %i[ new create ]

  def create
    @story = Current.user.stories.create!(story_params)
    redirect_to @story
  end

  private

  def set_initial_chapter
    @initial_chapter = case params[:from]
      when 'setup' then @story.setup || @story.beginning
      when nil, 'beginning' then @story.beginning
      else raise ArgumentError, "unknown initial chapter #{params[:from].inspect}"
      end
  end

  def find_story
    @story = Story.find(params[:id])
  end

  def story_params
    params.require(:story).permit(:title, :subtitle, :description)
  end
end
