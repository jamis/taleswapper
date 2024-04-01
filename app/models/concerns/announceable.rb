module Announceable
  extend ActiveSupport::Concern

  def announced?
    announced_at.present?
  end

  def announce!(now = Time.now)
    update! announced_at: now
  end
end
