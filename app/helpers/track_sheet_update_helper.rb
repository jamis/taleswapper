module TrackSheetUpdateHelper
  def each_update_entry(track_sheet_update)
    sheet = track_sheet_update.section.current_track_sheet
    track_sheet_update.definition.each do |entry|
      yield sheet, entry
      track_sheet_update.apply_action_to(sheet, entry)
    end
  end

  def render_track_sheet_update_entry(sheet, entry)
    case entry['action']
    when 'add'
      render_track_sheet_update_add(sheet, entry)
    when 'update'
      render_track_sheet_update_update(sheet, entry)
    when 'delete'
      render_track_sheet_update_delete(sheet, entry)
    else raise ArgumentError, "unsupported entry action #{entry['action'].inspect}"
    end
  end

  def render_track_sheet_element(name, type, value, prior = nil)
    render "track_sheet_updates/types/#{type}", name: name, value: value, prior: prior
  end

  def namespace_name(namespace)
    if namespace.is_a?(Array)
      namespace.join(' &rarr; ').html_safe
    else
      namespace
    end
  end

  def is_namespace?(value)
    !value.key?('_type')
  end

  private

  def render_track_sheet_update_add(sheet, entry)
    render 'track_sheet_updates/add', sheet: sheet, entry: entry
  end

  def render_track_sheet_update_update(sheet, entry)
    priors = sheet.dig(*entry['parent'])
    render 'track_sheet_updates/update', sheet: sheet, entry: entry, priors: priors
  end

  def render_track_sheet_update_delete(sheet, entry)
    priors = sheet.dig(*entry['parent'])
    render 'track_sheet_updates/delete', sheet: sheet, entry: entry, priors: priors
  end
end
