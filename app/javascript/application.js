// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "./controllers"

import Services from "./services"

window.TaleSwapper ||= {}
window.TaleSwapper.Services ||= new Services();

import TrackerUpdatesTag from "./elements/tracker_updates_tag"

customElements.define("ts-tracker-updates", TrackerUpdatesTag);
