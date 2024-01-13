class TrackerTemplatesController < ApplicationController
  before_action :require_authentication
  before_action :find_template, only: %w[ show ]

  def index
    @templates = Current.user.tracker_templates
  end

  private

  def find_template
    @template = Current.user.tracker_templates.find(params[:id])
  end
end
