module TrackerTemplatesHelper
  def render_tracker_template_element(element, value: nil, changed: false, display: false, readonly: false)
    render partial: "tracker_templates/elements/#{element['type']}", locals: { element: element, value: value, changed: changed, display: display, readonly: readonly }
  end

  def default_card_from(card_deck)
    Hash[card_deck.definition.map { |el| [ el['name'], el['name'] ] }]
  end

  def tracker_value(tracker, *args)
    tracker.value(*args) if tracker.respond_to?(:value)
  end

  def tracker_changed?(tracker, *args)
    tracker.element_changed?(*args) if tracker.respond_to?(:element_changed?)
  end

  def tracker_cards(tracker)
    tracker.respond_to?(:data) ? tracker.data : [ default_card_from(tracker.template) ]
  end
end
