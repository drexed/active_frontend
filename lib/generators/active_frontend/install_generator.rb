# frozen_string_literal: true

require 'rails/generators'

module ActiveFrontend
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('../templates', __FILE__)

    def copy_javascript_file
      copy_file('install.js', 'vendor/assets/javascripts/active_frontend.js')
    end

    def copy_stylesheet_file
      copy_file('install.scss', 'vendor/assets/stylesheets/active_frontend.scss')
    end

  end
end
