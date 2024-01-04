module ApplicationHelper
  def md(text)
    Kramdown::Document.new(text, auto_ids: false).to_html.html_safe
  end

  def section_classes(section)
    case section.role
    when 'primary' then 'mt-4 min-w-72 w-1/2'
    when 'secondary' then 'mt-4 text-sm ml-auto italic text-gray-400 min-w-64 w-1/2'
    else raise ArgumentError, "unsupported section role #{section.role.inspect}"
    end
  end

  def editable_story?(story = @story)
    Current.user == story.creator
  end

  def editable_chapter?(chapter = @chapter)
    editable_story?(chapter.story)
  end
end
