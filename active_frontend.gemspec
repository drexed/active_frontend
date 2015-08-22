# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'active_frontend/version'

Gem::Specification.new do |spec|
  spec.name          = "active_frontend"
  spec.version       = ActiveFrontend::VERSION
  spec.authors       = ["Juan Gomez"]
  spec.email         = ["j.gomez@drexed.com"]

  spec.description   = %q{ActiveFrontend is a refreshingly modern responsive web framework for beautiful and faster project development.}
  spec.summary       = %q{ActiveFrontend Responsive Web Framework}
  spec.homepage      = "https://github.com/drexed/active_frontend"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_runtime_dependency "rails"

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "coveralls"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "rspec"
  spec.add_development_dependency "generator_spec"
end