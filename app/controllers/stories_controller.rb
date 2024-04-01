class StoriesController < ApplicationController
  before_action :find_story, only: %i[ show edit update destroy announce ]
  before_action :require_authentication, only: %i[ new edit update create destroy announce ]

  def new
    @story = Story.new(title: "Untitled")
  end

  def announce
    @story.notify!
    redirect_to story_url(@story), notice: "Your story has been announced!"
  end

  def create
    @story = Current.user.stories.create!(story_params)
    redirect_to @story
  end

  def update
    @story.update!(story_params)
    redirect_to @story
  end

  def destroy
    @story.soft_delete!
    redirect_to creator_path(@story.creator), notice: "\"#{@story.title}\" has been deleted."
  end

  private

  def find_story
    @story = Story.alive.find(params[:id])
  end

  def story_params
    params.require(:story).permit(:title, :subtitle, :description, :interactive, :archived)
  end
end
