Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resource :session

  resources :creators

  resources :stories do
    resources :chapters, only: %i[ new create ]
    resource :scratch_pad
    resources :trackers, only: %i[ index new create ]
  end

  resources :chapters
  resources :trackers
  resources :tracker_templates

  root "creators#index"
end
