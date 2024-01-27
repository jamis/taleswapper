class ChaptersController < ApplicationController
  before_action :find_chapter, only: %i[ show edit update destroy ]
  before_action :require_authentication, only: %i[ new create edit update destroy ]
  before_action :require_own_property, only: %i[ edit update destroy ]
  before_action :find_story, only: %i[ new create ]

  def new
    @chapter = @story.chapters.build(sections: [ Section.new ])
  end

  def update
    @chapter.update(chapter_params)
    redirect_to @chapter
  end

  def create
    @chapter = @story.chapters.create!(chapter_params)
    redirect_to @chapter
  end

  def destroy
    @chapter.destroy
    redirect_to @story
  end

  private

  def require_own_property
    if !Current.user.stories.find(@story.id)
      redirect_to @chapter
    end
  end

  def find_chapter
    @chapter = Chapter.find(params[:id])
    @story = @chapter.story
  end

  def find_story
    @story = Current.user.stories.find(params[:story_id])
  end

  def chapter_params
    params.require(:chapter).permit(:title, :interactive, :published, :role, sections_attributes: {})
  end
end
