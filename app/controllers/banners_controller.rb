class BannersController < ApplicationController
  include ActiveStorage::SetCurrent
  include BannersHelper

  before_action :require_authentication
  before_action :load_container

  def create
    @container.update(container_params)
    redirect_to polymorphic_banner_path(@container), flash: { created: true }
  end

  def pick
    @blobs = Current.user.stories.attachments.map(&:blob).uniq
  end

  def update
    if params[:banner] # it's a metadata update
      blob = @container.banner.blob
      blob.metadata.update(metadata_params)
      blob.save!
    else # we're picking a banner from an existing image
      @container.update(container_params)
    end

    redirect_to polymorphic_banner_path(@container)
  end

  def destroy
    @container.banner_attachment&.destroy
    redirect_to polymorphic_banner_path(@container)
  end

  private

  def container_label
    @container.class.name.underscore.to_sym
  end

  def container_params
    params.require(container_label).permit(:banner)
  end

  def metadata_params
    params.require(:banner).permit(:ts_alt, :ts_credits)
  end

  def load_container
    @container = if params[:chapter_id]
        Chapter.find(params[:chapter_id]).tap do |chapter|
          # make sure the chapter is one owned by the current user...
          Current.user.stories.find(chapter.story_id)
        end
      else
        Current.user.stories.find(params[:story_id])
      end
  end
end
