class ScratchPad < ApplicationRecord
  belongs_to :chapter, touch: true
end
