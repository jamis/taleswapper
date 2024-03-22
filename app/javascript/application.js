// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

import "quill-config"
import "@rails/actiontext"
import Services from "services"

window.TaleSwapper ||= {}
window.TaleSwapper.Services ||= new Services();
