class ChaptersController < ApplicationController
  include ActiveStorage::SetCurrent

  before_action :require_authentication, only: %i[ new create edit update destroy publish revoke ]
  before_action :find_story, only: %i[ new create ]
  before_action :find_chapter, only: %i[ show edit update destroy publish revoke ]
  before_action :build_chapter, only: %i[ new ]
  before_action :require_own_property, only: %i[ new create edit update destroy publish revoke ]
  before_action :infer_track_sheet, only: %i[ new ]
  before_action :fetch_track_sheet, only: %i[ edit ]

  def new
    render 'edit'
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

  def publish
    @chapter.publish!
    @chapter.notify! if params['notify']
    redirect_to @chapter
  end

  def revoke
    @chapter.revoke!
    redirect_to @chapter
  end

  private

  def require_own_property
    if !Current.user.stories.alive.find(@story.id)
      redirect_to @chapter
    end
  end

  def build_chapter
    initial_title = (params[:role] == 'setup') ? 'Story Setup' : nil
    @chapter = @story.chapters.build(role: params[:role], title: initial_title, prequel_id: params[:prequel_id])
  end

  def find_chapter
    @chapter = Chapter.find(params[:id])
    @story = @chapter.story

    if @story.deleted?
      render_404
    elsif !@chapter.published? && @story.creator != Current.user
      redirect_to @story
    end
  end

  def find_story
    @story = Current.user.stories.alive.find(params[:story_id])
  end

  def chapter_params
    params.require(:chapter).permit(:title, :interactive, :role, :content)
  end

  def infer_track_sheet
    @track_sheet_defn = @chapter.track_sheet_origin&.final_track_sheet
  end

  def fetch_track_sheet
    @track_sheet_defn = @chapter.track_sheet&.definition
  end
end
