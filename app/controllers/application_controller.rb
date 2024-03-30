class ApplicationController < ActionController::Base
  include Authentication

  private

  def render_404
    render file: Rails.root.join('public/404.html'), layout: false
  end
end
