// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

import Services from "services"

window.TaleSwapper ||= {}
window.TaleSwapper.Services ||= new Services();
