set :application,       "store"
set :domain,            "ssh.klinkdelivery.com"
set :deploy_to,         "/home/klink/store"
set :user,              "klink"
set :password,          "urJ9Y9unyPSt5Gvw"
set :webserver_user,    "nginx"

role :web,        domain
role :app,        domain
role :db,         domain, :primary => true

set :branch,      "master"

set :use_set_permissions, true

after "deploy:update", "deploy:cleanup"