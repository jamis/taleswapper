module ApplicationHelper
  def md(text)
    Kramdown::Document.new(text, auto_ids: false).to_html.html_safe
  end

  def editable_story?(story = @story)
    Current.user == story.creator
  end

  def editable_chapter?(chapter = @chapter)
    editable_story?(chapter.story)
  end
end
