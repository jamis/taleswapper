Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resource :session

  resources :creators

  resources :stories do
    resources :chapters, only: %i[ new create ]
    resources :comments, only: %i[ create ]
    resources :sequels, only: %i[ new create ]
  end

  resources :chapters do
    resource :track_sheet
    resources :comments, only: %i[ create ]
    resources :sequels, only: %i[ new create ]
  end

  resources :scratch_pads, only: %i[ show update ]

  resources :users do
    member do
      get :pending
    end
  end

  get '/confirm/:token', to: 'users#confirm', as: :confirm_user
  get '/resend/:token', to: 'users#resend', as: :resend_user

  root "creators#index"
end
