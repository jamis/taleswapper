class ChaptersController < ApplicationController
  before_action :find_chapter, only: %i[ show edit ]
  before_action :require_authentication, only: %i[ new create edit ]
  before_action :find_story, only: %i[ new create ]

  def new
    @chapter = @story.chapters.build(sections: [ Section.new ])
  end

  def create
    raise NotImplementedError
  end

  private

  def find_chapter
    @chapter = Chapter.find(params[:id])
    @story = @chapter.story
  end

  def find_story
    @story = Current.user.stories.find(params[:story_id])
  end
end
