# ActiveFrontend

[![Gem Version](https://badge.fury.io/rb/active.svg)](http://badge.fury.io/rb/active_frontend)
[![Build Status](https://travis-ci.org/drexed/active_frontend.svg?branch=master)](https://travis-ci.org/drexed/active_frontend)
[![Coverage Status](https://coveralls.io/repos/drexed/active_frontend/badge.png)](https://coveralls.io/r/drexed/active_frontend)

[ActiveFrontend](https://github.com/drexed/active_frontend) is a refreshingly modern responsive web framework for beautiful and faster project development.

To get started, check out [https://github.com/drexed/active](https://github.com/drexed/active)!

## Installation

Add this line to your application's Gemfile:

    gem 'active_frontend'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install active_frontend

## Table of Contents

* [Configuration](#configuration)
* [Stylesheets](#stylesheets)
* [Javascripts](#javascripts)

## Configuration

`rails generate active_frontend:install` will generate the following `active_frontend.js` and `active_frontend.scss` file and add it within `vendor/assets/javascripts` and `vendor/assets/stylesheets` directories respectively.

## Stylesheets

Add the CSS files you want to include:

```ruby
*= require color.css (place before any files)
*= require reset.css (place before any files)
*= require ad.css
*= require affix.css
*= require alert.css
*= require animation.css
*= require breadcrumb.css
*= require button.css
*= require carousel.css
*= require canvas.css
*= require chart.css
*= require code.css
*= require collapse.css
*= require colorpicker.css
*= require datepicker.css
*= require dropdown.css
*= require footer.css
*= require form.css
*= require grid.css
*= require header.css
*= require icon.css
*= require image.css
*= require label_and_badge.css
*= require link.css
*= require list.css
*= require loader.css
*= require map.css
*= require missive.css
*= require modal.css
*= require aside.css (place after modal)
*= require nav_and_tab.css
*= require navbar.css
*= require pagination.css
*= require panel.css
*= require placeholder.css
*= require progress.css
*= require sidebar.css
*= require slider.css
*= require spinner.css
*= require swoggle.css
*= require table.css
*= require timepicker.css
*= require toolbar.css
*= require tooltip.css
*= require popover.css (place after tooltip)
*= require transition.css
*= require trunk.css
*= require typeahead.css
*= require typography.css
```

## Javascripts

Add the JS files you want to include:

```ruby
//= require affix.js
//= require alert.js
//= require animation.js
//= require button.js
//= require carousel.js
//= require chart.js
//= require collapse.js
//= require color_picker.js
//= require date_picker.js
//= require dropdown.js
//= require file_input.js
//= require hoverdown.js
//= require inputmask.js
//= require loader.js
//= require map.js
//= require modal.js
//= require scrollspy.js
//= require slider.js
//= require sort.js
//= require swoggle.js
//= require tab.js
//= require tablespy.js
//= require timeago.js
//= require time_picker.js
//= require tooltip.js
//= require popover.js (place after tooltip)
//= require transition.js
//= require typeahead.js
```

## Contributing

1. Fork it ( https://github.com/[my-github-username]/active_frontend/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request