class ChaptersController < ApplicationController
  before_action :find_chapter

  def show
    respond_to do |format|
      format.turbo_stream
    end
  end

  private

  def find_chapter
    @chapter = Chapter.find(params[:id])
  end
end
