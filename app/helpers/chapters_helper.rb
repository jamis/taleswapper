module ChaptersHelper
  def render_section(section)
    render partial: "sections/roles/#{section.role}", locals: { section: section }
  end
end
