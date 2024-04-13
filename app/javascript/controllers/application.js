import { Application } from "@hotwired/stimulus"
import TrackerUpdatesTag from "elements/tracker_updates_tag"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

customElements.define("ts-tracker-updates", TrackerUpdatesTag);

export { application }
