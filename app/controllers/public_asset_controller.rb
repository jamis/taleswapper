class PublicAssetController < ActionController::Base
  def show
    blob_id = ActiveStorage::Blob.signed_id_verifier.verified(params[:signed_id], purpose: :blob_id)
    blob = ActiveStorage::Blob.find(blob_id)

    redirect_to story_asset_url(blob), allow_other_host: true
  end
end
