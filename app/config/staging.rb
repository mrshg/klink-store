set :application, "klink-dev"
set :domain,      "klink-dev.locastic.com"

role :web,        domain
role :app,        domain
role :db,         domain, :primary => true
ssh_options[:port] = "1338"

set :branch,      "master"

after "deploy:update_code" do
  capifony_pretty_print "--> Ensuring cache directory permissions"
  run "chmod -R 755 /home/klinkdev/"
  capifony_puts_ok
end

after "deploy:update", "deploy:cleanup"
after "deploy", "deploy:set_permissions"