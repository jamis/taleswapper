# Pin npm packages by running ./bin/importmap

pin "application", preload: true

pin "services"
pin "utilities"
pin "drafts"
pin "track-sheet"

pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
