require 'coveralls'
Coveralls.wear!

require 'fileutils'
require 'pathname'
require 'generator_spec'
require 'active_frontend'

spec_tmp_path = Pathname.new(File.expand_path('../spec/lib/generators/tmp', File.dirname(__FILE__)))

RSpec.configure do |config|
  config.after(:all) { FileUtils.remove_dir(spec_tmp_path) if File.directory?(spec_tmp_path) }
end