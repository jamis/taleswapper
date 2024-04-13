class TrackSheetUpdate < ApplicationRecord
  belongs_to :section
  serialize :data, coder: JSON
  alias_attribute :definition, :data
end

class Section < ApplicationRecord
  belongs_to :chapter
  has_rich_text :content
  has_one :track_sheet_update
  scope :in_order, -> { order(position: :asc) }
end

class Chapter < ApplicationRecord
  has_many :sections
  has_rich_text :content
end

class ConsolidateSections < ActiveRecord::Migration[7.1]
  def up
    convert_sections!
    remove_section_rich_texts!

    drop_table :sections
    drop_table :track_sheet_updates
  end

  def convert_sections!
    count = ActionText::RichText.where(record_type: 'Section').count
    return if count < 1

    ActionText::RichText.where(record_type: 'Chapter').delete_all

    Chapter.includes(sections: :track_sheet_update).find_each do |chapter|
      content = chapter.sections.in_order.map do |section|
        updates = section.track_sheet_update&.definition
        body = section.content.to_s

        if updates.present?
          body = "#{body}<ts-tracker-updates data-updates=#{CGI.escape_html(updates.to_json.inspect)}></ts-tracker-updates>\n"
        end

        body = "<aside>\n#{body}</aside>\n" if section.role == 'aside'

        body
      end

      content = content.join
      content.gsub!(/<\/aside>\s*<aside>\s*/m, '')

      chapter.update content: content
    end
  end

  def remove_section_rich_texts!
    # this is safe, because prior to this migration, there were no attachments
    # associated with any of the rich texts in the database.
    ActionText::RichText.where(record_type: 'Section').delete_all
  end
end
