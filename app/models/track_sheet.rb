class TrackSheet < ApplicationRecord
  belongs_to :chapter, touch: true

  serialize :definition, coder: JSON

  def apply(updates)
    Marshal.load(Marshal.dump(definition || {})).tap do |copy|
      updates.each { |update| apply_update_to(copy, update) }
    end
  end

  private

  def apply_update_to(sheet, update)
    node = update['parent'] && find_parent(sheet, update['parent'])
    return unless node

    case update['action']
    when 'add' then
      node.update(update['child'])
    when 'update' then
      update['child'].each do |key, value|
        node[key]['value'] = value if node[key]
      end
    when 'rename' then
      update['child'].each do |old_name, new_name|
        node[new_name] = node.delete(old_name)
      end
    when 'remove' then
      update['child'].each { |child| node.delete(child) }
    else
      raise NotImplementedError, update['action']
    end
  end

  # Same as Hash#dig, but it also creates missing intermediate Hashes.
  def find_parent(sheet, path)
    path.inject(sheet) do |node, key|
      node[key] ||= {}
    end
  end
end
