class BookmarksController < ApplicationController
  before_action :find_chapter, only: %i[ index ]
  before_action :find_user
  before_action :find_bookmark, only: %i[ show edit update destroy ]
  before_action :require_self

  def index
    @bookmarks = @user.bookmarks.where(chapter: @chapter).organized
  end

  def create
    @bookmark = @user.bookmarks.create(bookmark_params)
    @bookmarks = @user.bookmarks.where(chapter: @bookmark.chapter)
  end

  def update
    @bookmark.update(bookmark_params)
  end

  def destroy
    @bookmark.destroy
  end

  private

  def bookmark_params
    params.
      require(:bookmark).
      permit(:chapter_id, :anchor, :name, :description)
  end

  def find_chapter
    @chapter = Chapter.find(params[:chapter_id])
  end

  def find_user
    @user = params[:user_id] ? User.find(params[:user_id]) : Current.user
  end

  def find_bookmark
    @bookmark = @user.bookmarks.find(params[:id])
  end

  def require_self
    render_404 if @user != Current.user
  end
end
