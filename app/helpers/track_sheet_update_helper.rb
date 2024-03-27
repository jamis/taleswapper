module TrackSheetUpdateHelper
  def each_update_entry(track_sheet_update)
    sheet = track_sheet_update.section.current_track_sheet
    track_sheet_update.consolidated.each do |path, list|
      yield :start_cohort, path
      list.each do |entry|
        yield :entry, path, sheet, entry
        track_sheet_update.apply_action_to(sheet, entry)
      end
      yield :end_cohort
    end
  end

  def each_update_child(entry, sheet)
Rails.logger.debug("\n\n*** ENTRY #{entry.inspect}\n\n")
    entry['child'].each do |name, value|
      if value.is_a?(Hash)
        yield name, value['_type'], value['value'], nil
      else
        node = sheet.dig(*entry['parent'], name)
        node = { '_type' => 'group' } unless node['_type']
        yield name, node['_type'], value, node['value']
      end
    end
  end

  def render_track_sheet_update_entry(sheet, entry)
    case entry['action']
    when 'add'
      render_track_sheet_update_add(sheet, entry)
    when 'update'
      render_track_sheet_update_update(sheet, entry)
    when 'remove'
      render_track_sheet_update_remove(sheet, entry)
    when 'noop'
      # do nothing, no-op
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

  def compact_namespace(name, value)
    chain = [ name ]

    while value.length == 1 && is_namespace?(value.values.first)
      name = value.keys.first
      value = value[name]
      chain << name
    end

    [ chain, value ]
  end

  private

  def render_track_sheet_update_add(sheet, entry)
    render 'track_sheet_updates/add', sheet: sheet, entry: entry
  end

  def render_track_sheet_update_update(sheet, entry)
    priors = sheet.dig(*entry['parent'])
    render 'track_sheet_updates/update', sheet: sheet, entry: entry, priors: priors
  end

  def render_track_sheet_update_remove(sheet, entry)
    priors = sheet.dig(*entry['parent'])
    render 'track_sheet_updates/remove', sheet: sheet, entry: entry, priors: priors
  end
end
