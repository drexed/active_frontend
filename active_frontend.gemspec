# frozen_string_literal: true

lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'active_frontend/version'

Gem::Specification.new do |spec|
  spec.name = 'active_frontend'
  spec.version = ActiveFrontend::VERSION
  spec.authors = ['Juan Gomez']
  spec.email = ['j.gomez@drexed.com']

  # rubocop:disable Metrics/LineLength
  spec.description = 'ActiveFrontend is a refreshingly modern responsive web framework for beautiful and faster project development.'
  # rubocop:enable Metrics/LineLength
  spec.summary = 'ActiveFrontend Responsive Web Framework'
  spec.homepage = 'https://github.com/drexed/active_frontend'
  spec.license = 'MIT'

  spec.files = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir = 'exe'
  spec.executables = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = %w[lib]

  spec.add_runtime_dependency 'rails'

  spec.add_development_dependency 'bundler'
  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'rspec'
  spec.add_development_dependency 'generator_spec'
  spec.add_development_dependency 'fasterer'
  spec.add_development_dependency 'reek'
  spec.add_development_dependency 'rubocop'
end
