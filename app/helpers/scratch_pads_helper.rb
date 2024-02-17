module ScratchPadsHelper
  def scratch_pad_title(scratch_pad)
    case scratch_pad
    when ScratchPad::StoryNotes then 'Story Notes'
    when ScratchPad::Outline then 'Chapter Outline'
    else raise ArgumentError, "not a recognized scratch pad: #{scratch_pad.inspect}"
    end
  end

  def scratch_pad_color(scratch_pad)
    case scratch_pad
    when ScratchPad::StoryNotes then :yellow
    when ScratchPad::Outline then :blue
    else raise ArgumentError, "not a recognized scratch pad: #{scratch_pad.inspect}"
    end
  end
end
