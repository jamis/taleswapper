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

  def breadcrumbs
    @breadcrumbs || []
  end

  def breadcrumb(text, link: nil, priority: nil)
    @breadcrumbs ||= []
    @breadcrumbs << { text: text, link: link, priority: priority }
  end

  def breadcrumb_styles(crumb)
    "hidden #{crumb[:priority]}:inline" if crumb[:priority]
  end

  def crumbs_for(record, leaf: true)
    case record
    when Chapter
      crumbs_for(record.story, leaf: false)
      breadcrumb record.title, link: leaf ? nil : chapter_path(record)
    when Story
      crumbs_for(record.creator, leaf: false)
      breadcrumb record.title, link: leaf ? nil : story_path(record), priority: leaf ? nil : 'md'
    when User
      breadcrumb record.display_name, link: leaf ? nil : creator_path(record), priority: leaf ? nil : 'lg'
    else raise "no crumbs for #{record.inspect}"
    end
  end
end
