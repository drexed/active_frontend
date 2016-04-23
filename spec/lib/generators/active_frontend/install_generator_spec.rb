require 'spec_helper'

describe ActiveFrontend::InstallGenerator, type: :generator do
  destination(File.expand_path("../../tmp", __FILE__))

  before(:all) do
    prepare_destination
    run_generator
  end

  it "to be true" do
    sample_path = "spec/lib/generators/tmp/vendor/assets/javascripts/active_frontend.js"

    expect_file = File.read("spec/support/generators/sample.js")
    sample_file = File.read(sample_path)

    expect(File.exist?(sample_path)).to eq(true)
    expect(sample_file).to eq(expect_file)
  end

  it "to be true" do
    sample_path = "spec/lib/generators/tmp/vendor/assets/stylesheets/active_frontend.scss"

    expect_file = File.read("spec/support/generators/sample.scss")
    sample_file = File.read(sample_path)

    expect(File.exist?(sample_path)).to eq(true)
    expect(sample_file).to eq(expect_file)
  end

end
