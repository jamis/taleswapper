class TrackSheetUpdate < ApplicationRecord
  include Enumerable

  belongs_to :section

  serialize :definition, coder: JSON

  def definition_as_json
    definition.to_json
  end

  def definition_as_json=(json)
    self.definition = JSON.parse(json)
  end

  def each(&block)
    definition.each(&block)
    self
  end

  def apply_to(sheet)
    definition.each do |action|
      apply_action_to(sheet, action)
    end
  end

  def apply_action_to(sheet, action)
    node = find_parent(sheet, action['parent'])

    case action['action']
    when 'add' then
      node.update(action['child'])
    when 'update' then
      action['child'].each do |key, value|
        node[key]['value'] = value
      end
    when 'remove' then
      action['child'].each { |child| node.delete(child) }
    else
      raise NotImplementedError, action['action']
    end
  end

  private

  # Same as Hash#dig, but it also creates missing intermediate Hashes.
  def find_parent(sheet, path)
    path.inject(sheet) do |node, key|
      node[key] ||= {}
    end
  end
end
