+function ($) {
  'use strict';

  // HEADER CLASS DEFINITION
  // =======================

  var Header = function (element, options) {
    this.$element = $(element);
    this.$window = $(window);
    this.settings = {
      addClass: this.$element.data('add-class'),
      offset: this.$element.data('offset'),
      removeClass: this.$element.data('remove-class')
    };
    this.options = $.extend({}, Header.DEFAULTS, this.settings, options);

    this.init();
  };

  Header.VERSION = '1.0.0';
  Header.DEFAULTS = {
    addClass: '',
    offset: 10,
    onSwapClassCallback: function () {},
    removeClass: 'background-color-transparent border-color-bottom-transparent'
  };

  Header.prototype.constructor = Header;

  Header.prototype.init = function () {
    var _self = this;

    this.$window.scroll(function () {
      _self.toggleClasses();
    });
  };

  Header.prototype.swapClass = function (removeClass, addClass) {
    this.$element
      .removeClass(removeClass)
      .addClass(addClass);

    this.options.onSwapClassCallback();
  };

  Header.prototype.toggleClasses = function () {
    if (this.$window.scrollTop() >= this.options.offset) {
      this.swapClass(this.options.removeClass, this.options.addClass);
    } else {
      this.swapClass(this.options.addClass, this.options.removeClass);
    }
  };

  // HEADER PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.header');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.header', (data = new Header(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.header;

  $.fn.header = Plugin;
  $.fn.header.Constructor = Header;

  // HEADER NO CONFLICT
  // ==================

  $.fn.header.noConflict = function () {
    $.fn.header = old;
    return this;
  };

  // HEADER DATA-API
  // ===============

  $(document).on('ready.bs.header.data-api', function () {
    $('[data-toggle="header"]').each(function () {
      var $this = $(this);
      if ($this.data('header')) return;
      Plugin.call($this, $this.data());
    });
  });

}(jQuery);
