module ChaptersHelper
  include ActiveSupport::NumberHelper

  def render_section(section, first: false)
    render partial: "sections/roles/#{section.role}", locals: { section: section, first: first }
  end

  def visible_sequels(chapter)
    scope = chapter.actions
    scope = scope.published if chapter.story.creator != Current.user
    scope
  end
end
