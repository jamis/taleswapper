class CreatorsController < ApplicationController
  before_action :find_creator, except: %i[ index ]

  private

  def find_creator
    @creator ||= User.creators.find(params[:id])
  end
end
