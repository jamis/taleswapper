module ChaptersHelper
  include ActiveSupport::NumberHelper

  def render_section(section)
    first_primary_section = !@seen_first_primary_section && section.role == 'primary'
    render(partial: "sections/roles/#{section.role}", locals: { section: section, first: first_primary_section }).tap do
      @seen_first_primary_section ||= first_primary_section
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
end
