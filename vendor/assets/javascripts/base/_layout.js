+function ($) {
  'use strict';

  // LAYOUT CLASS DEFINITION
  // =======================

  var Layout = function (element, options) {
    this.$element = $(element);
    this.$window = $(window);
    this.settings = {
      direction: this.$element.data('direction'),
      effect: this.$element.data('effect'),
      target: this.$element.data('target')
    };
    this.options = $.extend({}, Layout.DEFAULTS, this.settings, options);

    this.init();
    this.toggleViewport();
  };

  if (!$.fn.animation) throw new Error('Layout requires animation.js');

  Layout.VERSION = '1.0.0';
  Layout.DEFAULTS = {
    direction: 'left',
    effect: 'slide',
    onToggleCallback: function (toggle) {},
    target: '#layout-target'
  };

  Layout.prototype.constructor = Layout;

  Layout.prototype.init = function () {
    var _self = this;
    var options = this.options;

    this.$element.click(function () {
      var target = $(_self.options.target);
      var next = _self.getNext();
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

      _self.options.onToggleCallback(toggle);
    });
  };

  Layout.prototype.getNext = function () {
    var next = $(this.options.target).next();
    var id = next.attr('id');

    if (id === undefined || id === '') {
      id = 'show-bs-layout';
      next.attr('id', id);
    }

    return $('#' + id);
  };

  Layout.prototype.togglePosition = function (klass) {
    var target = $(this.options.target);

    if (this.$window.width() < 767) {
      target.addClass(klass);
    } else {
      target.removeClass(klass);
    }
  };

  Layout.prototype.toggleViewport = function () {
    var _self = this;

    this.togglePosition('hidden fixed');

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
