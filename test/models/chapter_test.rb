require "test_helper"

class ChapterTest < ActiveSupport::TestCase
  test "sets default title if not set" do
    story = stories(:test_story)
    chapter = story.chapters.create!(content: "<p>A new beginning!</p>")

    assert chapter.persisted?
    assert_equal "Untitled", chapter.title
  end

  test "updates push track sheet changes forward" do
    chapter = chapters(:test_story_chapter1)

    update = { action: 'add', parent: [ 'Foo' ], child: { 'Bar' => { '_type' => 'short', 'value' => '5' } } }.to_json
    chapter.update content: chapter.content.to_s + "\n<ts-tracker-updates data-updates=\"#{CGI.escapeHTML(update)}\"></ts-tracker-updates>\n".html_safe

    assert chapters(:test_story_chapter2).track_sheet.definition.key?('Foo')
    assert chapters(:test_story_chapter3).track_sheet.definition.key?('Foo')
  end

  test "referencing an image links it to the chapter" do
    chapter = chapters(:test_story_chapter3)

    new_blob = ActiveStorage::Blob.create!(key: 'abc',
      filename: 'test.png', byte_size: 12_345, checksum: 'defghijklmn',
      content_type: 'image/png', service_name: 'local')

    img = %{<ts-image filename="test.png" signed-id="#{new_blob.signed_id}"></ts-image>}
    chapter.update content: chapter.content.to_s + "\n#{img}".html_safe

    assert new_blob.reload.attachments.any?
    assert chapter.images.any?
  end

  test "removing an image reference destroys the asset" do
    chapter = chapters(:test_story_chapter2)
    assert chapter.images.any?

    chapter.update content: chapter.content.to_s.gsub(/<ts-image.*?<\/ts-image>\s*/m, '')
    assert chapter.reload.images.none?
  end
end
