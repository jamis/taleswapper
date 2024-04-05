class CreatorsController < ApplicationController
  before_action :find_creator, except: %i[ index ]

  def show
    respond_to do |format|
      format.html
      format.rss
    end
  end

  private

  def find_creator
    @creator ||= User.creators.find(params[:id])
  end
end
