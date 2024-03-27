# Pin npm packages by running ./bin/importmap

pin "application", preload: true

pin "services"
pin "utilities"
pin "quill-config"
pin "drafts"
pin "track-sheet"

pin_all_from "app/javascript/quill-config", under: "quill-config"

pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "@rails/actiontext", to: "actiontext.esm.js"
