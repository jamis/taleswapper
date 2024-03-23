class AdminController < ApplicationController
  before_action :require_admin

  private

  def require_admin
    redirect_to :root if !Current.user&.admin?
  end
end
