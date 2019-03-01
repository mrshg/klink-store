set :application,       "store"
set :domain,            "test-ssh.klinkdelivery.com"
set :deploy_to,         "/home/klinkdev/store"
set :user,              "klink"
set :password,          "PknBYj69ZfwSgeDp"
set :webserver_user,    "nginx"

role :web,        domain
role :app,        domain
role :db,         domain, :primary => true

set :branch,      "master"

set :use_set_permissions, true

after "deploy:update", "deploy:cleanup"
