set :application,       "store"
set :domain,            "klink2-dev.locastic.com"
set :deploy_to,         "/home/klink2"
set :user,              "klink2"
set :password,          ",[9gd+pwZ?9;"

role :web,        domain
role :app,        domain
role :db,         domain, :primary => true
ssh_options[:port] = "1338"

set :branch,      "master"

after "deploy:update_code" do
  capifony_pretty_print "--> Ensuring cache directory permissions"
  run "chmod -R 755 /home/klink2/"
  capifony_puts_ok
end

after "deploy:update", "deploy:cleanup"
after "deploy", "deploy:set_permissions"