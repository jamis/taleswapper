class Chapter::EmbeddedImages
  attr_reader :tags

  def initialize(chapter)
    @tags = chapter.content.body.fragment.find_all('ts-image');
  end

  def signed_ids
    @signed_ids ||= tags.map { |img| img.attr('signed-id') }
  end

  def blob_ids
    @blob_ids ||= signed_ids.map { |id| ActiveStorage::Blob.signed_id_verifier.verified(id, purpose: :blob_id) }
  end

  def blobs
    ActiveStorage::Blob.find(blob_ids)
  end

  def attachments
    ActiveStorage::Attachment.where(blob_id: blob_ids)
  end
end
