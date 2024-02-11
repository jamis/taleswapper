module DialogHelper
  def dialog(title:, start: :open, on_close: :hide, color: :blue, id: '', &block)
    render('layouts/dialog',
           state: start, on_close: on_close, color: color, title: title, id: id,
           &block)
  end
end
