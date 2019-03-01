logger.level = Logger::MAX_LEVEL

set :deploy_to,   "/home/klinkdev"
set :user,        "klinkdev"
set :password, "uv@SSG_PCw^q"

set :stages,        %w(production staging klinkdev klinkprod klinkdev2)
set :default_stage, "staging"
set :stage_dir,     "app/config"
require 'capistrano/ext/multistage'

set :scm,         :git
set :repository,  "git@bitbucket.org:klink-technologies/klink-store.git"
set :deploy_via,  :remote_cache


ssh_options[:forward_agent] = true

set :use_composer,   true
set :update_vendors, false
default_run_options[:pty] = true
set :composer_options,  "--verbose --prefer-dist"

set :dump_assetic_assets, true

set :writable_dirs,     ["app/cache", "app/logs"]
set :webserver_user,    "nobody"
set :permission_method, :acl
set :use_set_permissions, false

set :shared_files,    ["app/config/parameters.yml", "web/.htaccess", "web/media"]
set :shared_children, ["app/logs"]

set :model_manager, "doctrine"

set :use_sudo,    false

set :keep_releases, 3

set :git_enable_submodules, 1

namespace :composer do
  task :copy_vendors, :except => { :no_release => true } do
    capifony_pretty_print "--> Copy vendor file from previous release"

    run "vendorDir=#{current_path}/vendor; if [ -d $vendorDir ] || [ -h $vendorDir ]; then cp -a $vendorDir #{latest_release}/vendor; fi;"
    capifony_puts_ok
  end
end


after "deploy:update_code", 'npm:install'

namespace :npm do
    desc 'Run npm install'
    task :install do
      capifony_pretty_print "--> Installing node components"
      invoke_command "sh -c 'cd #{latest_release} && npm install'"
      capifony_puts_ok
    end
end

after "deploy:update_code", 'gulp:compile'

namespace :gulp do
    desc 'Run gulp compile'
    task :compile do
      capifony_pretty_print "--> Running gulp prod"
      invoke_command "sh -c 'cd #{latest_release} && gulp compile'"
      capifony_puts_ok
    end
end

after "deploy:update_code", 'bower:install'

namespace :bower do
    desc 'Run bower install'
    task :install do
      capifony_pretty_print "--> Running bower install"
      invoke_command "sh -c 'cd #{latest_release} && bower install'"
      capifony_puts_ok
    end
end

before 'symfony:composer:install', 'composer:copy_vendors'
before 'symfony:composer:update', 'composer:copy_vendors'