# frozen_string_literal: true

require 'spec_helper'

describe ActiveFrontend::InstallGenerator, type: :generator do
  destination(File.expand_path('../../tmp', __FILE__))

  before(:all) do
    prepare_destination
    run_generator
  end

  let(:js_sample_path) { 'spec/lib/generators/tmp/vendor/assets/javascripts/active_frontend.js' }
  let(:css_sample_path) { 'spec/lib/generators/tmp/vendor/assets/stylesheets/active_frontend.scss' }

  describe '#generator' do
    context '#javascript' do
      it 'to be true when sample file exists' do
        expect(File.exist?(js_sample_path)).to eq(true)
      end

      it 'to be the same as the expected file' do
        expect_file = File.read('lib/generators/active_frontend/templates/install.js')
        sample_file = File.read(js_sample_path)

        expect(sample_file).to eq(expect_file)
      end
    end

    context '#stylesheet' do
      it 'to be true when sample file exists' do
        expect(File.exist?(css_sample_path)).to eq(true)
      end

      it 'to be the same as the expected file' do
        expect_file = File.read('lib/generators/active_frontend/templates/install.scss')
        sample_file = File.read(css_sample_path)

        expect(sample_file).to eq(expect_file)
      end
    end
  end

end
