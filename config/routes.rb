Seven6::Application.routes.draw do
    
  resources :users do
    member do
      get 'edit_password'
      get 'routes'
      get 'favorite_routes'
      get 'following'
      get 'followers'
      get 'following_routes'
    end
  end
  resources :routes
  resources :sessions, :only => [:new, :create, :destroy]
  resources :relationships, :only => [:create, :destroy]
  
  match '/signout', :to => 'sessions#destroy'
  match '/signin',  :to => 'sessions#new'
  match '/signup',  :to => 'users#new'
  match '/',        :to => 'pages#home'
  match '/test',    :to => 'pages#test' 

  
  post '/load_coordinates' => 'routes#load_coordinates'
  post '/start_markers' => 'routes#start_markers'

  post '/add_rating' => 'ratings#add_rating'
  post '/add_like' => 'ratings#add_like'

  post '/create_comment' => 'comments#create'
  post '/edit_comment' => 'comments#edit'
  post '/delete_comment' => 'comments#delete'


  post '/user_last_routes' => 'users#user_last_routes'


  get "pages/home"
  get "pages/test"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "pages#home"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
