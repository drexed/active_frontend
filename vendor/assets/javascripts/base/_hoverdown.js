+function ($) {
  'use strict';

  // HOVERDOWN CLASS DEFINITION
  // ==========================

  var Hoverdown = function (element, options) {
    this.$element = $(element);
    this.settings = {
      delay: this.$element.data('delay') || Hoverdown.DEFAULTS.delay,
      timeout: this.$element.data('timeout') || Hoverdown.DEFAULTS.timeout
    };
    this.options = $.extend({}, Hoverdown.DEFAULTS, this.settings, options);

    this.$parent = this.$element.parent();
    this.$dropmenu = this.$parent.find('.dropmenu').first();
    this.$timeout = null;

    this.init();
  };

  if (!$.fn.dropdown) throw new Error('Hoverdown requires dropdown.js');

  Hoverdown.VERSION = '1.0.0';
  Hoverdown.DEFAULTS = {
    delay: 500,
    onCloseMenuCallback: function () {},
    onHoverOutDelayCallback: function () {},
    onHoverOutTimeoutCallback: function () {},
    onOpenMenuCallback: function () {},
    timeout: 500
  };

  Hoverdown.prototype.constructor = Hoverdown;

  Hoverdown.prototype.init = function () {
    if ('ontouchstart' in document) return this;

    var _self = this;

    window.clearTimeout(this.$timeout);

    this.$parent.hover(function () {
      _self.openMenu();
    }, function () {
      _self.hoverOutTimeout();

      _self.$dropmenu.hover(function () {
        window.clearTimeout(_self.$timeout);
      }, function () {
        _self.hoverOutDelay();
      });
    });
  };

  Hoverdown.prototype.hoverOutTimeout = function () {
    var _self = this;

    this.$timeout = window.setTimeout(function () {
      _self.closeMenu();
    }, this.options.timeout);

    this.options.onHoverOutTimeoutCallback();
  };

  Hoverdown.prototype.hoverOutDelay = function () {
    var _self = this;

    window.setTimeout(function () {
      _self.closeMenu();
    }, this.options.delay);

    this.options.onHoverOutDelayCallback();
  };

  Hoverdown.prototype.openMenu = function () {
    this.$parent.addClass('open');
    this.$dropmenu.trigger('show.bs.dropdown');
    this.options.onOpenMenuCallback();
  };

  Hoverdown.prototype.closeMenu = function () {
    this.$parent.removeClass('open');
    this.$dropmenu.trigger('hide.bs.dropdown');
    this.options.onCloseMenuCallback();
  };

  // HOVERDOWN PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.hoverdown');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.hoverdown', (data = new Hoverdown(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.hoverdown;

  $.fn.hoverdown = Plugin;
  $.fn.hoverdown.Constructor = Hoverdown;

  // HOVERDOWN NO CONFLICT
  // =====================

  $.fn.hoverdown.noConflict = function () {
    $.fn.hoverdown = old;
    return this;
  };

  // HOVERDOWN DATA-API
  // ==================

  function PluginCall(_this) {
    var $this = $(_this);
    if ($this.data('hoverdown')) return;
    Plugin.call($this, $this.data());
  }

  if ($.fn.initialize) {
    $.initialize('[data-hover="dropdown"]', function() {
      PluginCall(this);
    });
  } else {
    $(document)
      .on('ready.bs.hoverdown.data-api', function () {
        $('[data-hover="dropdown"]').each(function () {
          PluginCall(this);
        });
      }).on('DOMCharacterDataModified.bs.hoverdown.data-api DOMSubtreeModified.bs.hoverdown.data-api DOMNodeInserted.bs.hoverdown.data-api', function () {
        $('[data-hover="dropdown"]').each(function () {
          PluginCall(this);
        });
      });
  }

}(jQuery);
