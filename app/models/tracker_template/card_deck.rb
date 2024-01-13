class TrackerTemplate::CardDeck < TrackerTemplate
  def value_for(version, name, index)
    version.data[index][name]
  end

  def prior_for(version, name, index)
    return nil unless version.original
    version.original.data[index][name]
  end
end
