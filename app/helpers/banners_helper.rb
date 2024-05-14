module BannersHelper
  def polymorphic_banner_path(container, prefix = nil)
    base = "#{container.class.name.underscore}_banner_path"
    base = "#{prefix}_#{base}" if prefix
    send(base, container)
  end
end
