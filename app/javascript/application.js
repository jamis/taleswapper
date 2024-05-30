// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import * as ActiveStorage from "@rails/activestorage"
import "./controllers"

import Services from "./services"

ActiveStorage.start();

window.TaleSwapper ||= {}
window.TaleSwapper.Services ||= new Services();

import TrackerUpdatesTag from "./elements/tracker_updates_tag"
import TSImageTag from "./elements/ts_image_tag"
import TSTrackSheetTag from "./elements/ts_track_sheet_tag"
import TSTrackerTag from "./elements/ts_tracker_tag"

customElements.define("ts-tracker-updates", TrackerUpdatesTag);
customElements.define("ts-image", TSImageTag);
customElements.define("ts-track-sheet", TSTrackSheetTag);
customElements.define("ts-tracker", TSTrackerTag);
