+function ($) {
  'use strict';

  // LAYOUT CLASS DEFINITION
  // =======================

  var Layout = function (element, options) {
    this.$element = $(element);
    this.$window = $(window);
    this.settings = {
      autoDetect: this.$element.data('auto-detect') || Layout.DEFAULTS.autoDetect,
      direction: this.$element.data('direction') || Layout.DEFAULTS.direction,
      effect: this.$element.data('effect') || Layout.DEFAULTS.effect,
      target: this.$element.data('target') || Layout.DEFAULTS.target
    };
    this.options = $.extend({}, Layout.DEFAULTS, this.settings, options);

    this.$initialClass = $(this.options.target).attr('class');

    this.init();
    this.toggleViewport();
  };

  if (!$.fn.animation) throw new Error('Layout requires animation.js');

  Layout.VERSION = '1.0.0';
  Layout.DEFAULTS = {
    autoDetect: true,
    direction: 'left',
    effect: 'slide',
    onToggleCallback: function (toggle) {},
    target: '#layout-target'
  };

  Layout.prototype.constructor = Layout;

  Layout.prototype.init = function () {
    var _self = this;
    var options = this.options;

    this.$element.click(function (e) {
      e.stopPropagation();
      e.preventDefault();

      var target = $(options.target);
      var toggle = 'out';

      if (target.hasClass('hidden') || target.is(':hidden') || target.css('visibility') === 'hidden') {
        toggle = 'in';
      }

      var effect = options.effect + '-' + toggle + '-' + options.direction;

      _self.togglePosition('fixed');
      target.animation({
        duration: 'xxs',
        effect: effect,
        hide: toggle === 'out'
      });

      options.onToggleCallback(toggle);
    });
  };

  Layout.prototype.togglePosition = function (klass) {
    var target = $(this.options.target);
    var isMobile = this.$window.width() < 767;

    if (this.options.autoDetect === true) {
      if (isMobile) {
        target.addClass(klass);
      } else {
        target.removeClass(klass);
      }
    } else {
      if (isMobile) {
        target.addClass(klass);
      } else {
        target.removeClass(klass)
          .addClass(this.$initialClass);
      }
    }
  };

  Layout.prototype.toggleViewport = function () {
    var _self = this;

    if (this.options.autoDetect === true) this.togglePosition('hidden fixed');

    this.$window.on('resize.bs.layout orientationChange.bs.layout', function () {
      _self.togglePosition('hidden fixed');
    });
  };

  // LAYOUT PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.layout');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.layout', (data = new Layout(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.layout;

  $.fn.layout = Plugin;
  $.fn.layout.Constructor = Layout;

  // LAYOUT NO CONFLICT
  // ==================

  $.fn.layout.noConflict = function () {
    $.fn.layout = old;
    return this;
  };

  // LAYOUT DATA-API
  // ===============

  $(document).on('ready.bs.layout.data-api', function () {
    $('[data-toggle="layout"]').each(function () {
      var $this = $(this);
      if ($this.data('layout')) return;
      Plugin.call($this, $this.data());
    });
  });

}(jQuery);
