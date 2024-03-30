require "test_helper"

class ChapterTest < ActiveSupport::TestCase
  test "sets default title if not set" do
    story = stories(:test_story)
    chapter = story.chapters.create!

    assert chapter.persisted?
    assert_equal "Untitled", chapter.title
  end

  test "updates push track sheet changes forward" do
    chapter = chapters(:test_story_chapter1)

    section = chapter.sections.first
    updates = section.track_sheet_update.definition
    updates.push({ action: 'add', parent: [ 'Foo' ], child: { 'Bar' => { '_type' => 'short', 'value' => '5' } } })

    chapter.update sections_attributes: { id: section.id, track_sheet_update_attributes: { id: section.track_sheet_update.id, data: updates.to_json } }

    assert chapters(:test_story_chapter2).track_sheet.definition.key?('Foo')
    assert chapters(:test_story_chapter3).track_sheet.definition.key?('Foo')
  end
end
