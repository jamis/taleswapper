class TrackSheetUpdate < ApplicationRecord
  include Enumerable

  belongs_to :section

  validate :definition_is_valid
  before_save :convert_definition

  attr_writer :definition

  def definition
    @definition ||= data.present? ? JSON.parse(data) : nil
  end

  def each(&block)
    definition&.each(&block)
    self
  end

  def apply_to(sheet)
    definition&.each do |action|
      apply_action_to(sheet, action)
    end
  end

  def apply_action_to(sheet, action)
    node = action['parent'] && find_parent(sheet, action['parent'])

    case action['action']
    when 'noop' then
      # no-op -- for testing
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

  def definition_is_valid
    data.present? && JSON.parse(data)
  rescue JSON::ParserError => e
    errors.add(:definition, 'is not valid JSON: ' + e.message)
  end

  def convert_definition
    self.data = @definition.to_json if @definition
  end

  # Same as Hash#dig, but it also creates missing intermediate Hashes.
  def find_parent(sheet, path)
    path.inject(sheet) do |node, key|
      node[key] ||= {}
    end
  end
end
