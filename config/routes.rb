Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resource :session
  resource :admin, controller: 'admin'

  resources :creators

  resources :stories do
    resources :chapters, only: %i[ new create ]
    resources :comments, only: %i[ create ]
    resources :sequels, only: %i[ new create ]
    resource :banner do
      get :pick
    end

    member do
      post :announce
    end
  end

  resources :chapters do
    resource :track_sheet
    resources :comments, only: %i[ create ]
    resources :sequels, only: %i[ new create ]
    resources :bookmarks, only: %i[ index ]
    resource :banner do
      get :pick
    end

    member do
      post :publish
      post :revoke
    end
  end

  resources :scratch_pads, only: %i[ show update ]

  resources :subscriptions
  resources :bookmarks, only: %i[ destroy ]

  resources :users do
    resources :subscriptions
    resources :bookmarks

    member do
      get :pending
      get :cancel
    end
  end

  get '/confirm/:token', to: 'users#confirm', as: :confirm_user
  get '/resend/:token', to: 'users#resend', as: :resend_user

  get '/public/asset/redirect/:signed_id/:filename', to: 'public_asset#show', as: :public_asset_redirect

  direct :story_asset do |blob|
    if blob.service_name != 'local' && ENV['CDN_URL']
      "#{ENV['CDN_URL']}/#{blob.key}"
    else
      route_for(:rails_blob, blob)
    end
  end

  root "creators#index"
end
