module StoriesHelper
  def render_contents(story)
    table_of_contents = []
    restricted = Current.user != story.creator

    story.walk_chapters(restricted: restricted) do |action, chapter|
      case action
      when :open        then table_of_contents << open_toc
      when :close       then table_of_contents << close_toc
      when :start_entry then table_of_contents << add_toc_entry(chapter)
      when :end_entry   then table_of_contents << end_toc_entry
      else raise ArgumentError, "unknown walk action #{action.inspect}"
      end
    end

    table_of_contents.join.html_safe
  end

  private

  def open_toc
    "<ul class=\"list-disc ml-8\">"
  end

  def close_toc
    "</ul>"
  end

  def add_toc_entry(chapter)
    tag.li do
      link_to(chapter.title.presence || "chapter", chapter_path(chapter), class: "ts-link") +
      possibly_unpublished_tag(chapter)
    end
  end

  def end_toc_entry
    "</li>"
  end

  def possibly_unpublished_tag(chapter)
    return tag.span if chapter.published?

    tag.span("[draft]", class: 'mx-2 text-sm text-red-600')
  end
end
