class TrackerTemplate::Attributes < TrackerTemplate
  def value_for(version, name)
    version.data[name]
  end

  def prior_for(version, name)
    return nil unless version.original
    version.original.data[name]
  end
end
