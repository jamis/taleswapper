module ChaptersHelper
  include ActiveSupport::NumberHelper

  def chapter_type(chapter)
    case chapter.role
    when 'setup' then 'Story Setup'
    when 'start' then 'First Chapter'
    else 'Chapter'
    end
  end

  def visible_sequels(chapter)
    scope = chapter.actions
    scope = scope.published if chapter.story.creator != Current.user
    scope
  end

  def chapter_content(chapter)
    CGI.escapeHTML(chapter.content.to_s).html_safe
  end

  def bookmarks_for(user, chapter)
    return '[]' if user.nil?

    user.bookmarks.where(chapter: chapter).map { |b| { id: b.id, anchor: b.anchor, url: user_bookmark_path(user, b) } }.to_json
  end
end
