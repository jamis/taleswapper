module DialogHelper
  def dialog(title:, start: :open, on_close: :hide, color: :blue, id: '', service_name: nil, &block)
    render('layouts/dialog',
           state: start,
           on_close: on_close,
           color: color,
           title: title,
           id: id,
           service_name: service_name,
           &block)
  end
end
