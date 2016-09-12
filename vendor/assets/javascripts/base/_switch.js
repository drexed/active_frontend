+function ($) {
  'use strict';

  // SWITCH PUBLIC CLASS DEFINITION
  // ==============================

  var Switch = function (element, options) {
    this.$element = $(element);
    this.settings = {
      baseClass: this.$element.data('base-class'),
      offClass: this.$element.data('off-class'),
      onClass: this.$element.data('on-class')
    };
    this.options = $.extend({}, Switch.DEFAULTS, this.settings, options);

    this.init();
  };

  Switch.VERSION = '1.0.0';
  Switch.DEFAULTS = {
    baseClass: 'switch',
    offClass: 'switch-color-light-haze',
    onClass: 'switch-color-green',
    text: {
      off: '<i class="icon-cross"></i>',
      on: '<i class="icon-checkmark"></i>'
    }
  };

  Switch.prototype.constructor = Switch;

  Switch.prototype.init = function () {
    var $switchHandle = $('<span class="switch-handle">');
    var $switchOn = $('<label class="switch-on">')
      .html(this.options.text.on)
      .addClass(this.options.onClass);
    var $switchOff = $('<label class="switch-off">')
      .html(this.options.text.off)
      .addClass(this.options.offClass);
    var $switchGroup = $('<div class="switch-group">')
      .append($switchOn, $switchOff, $switchHandle);
    var $switch = $('<div class="' + this.options.baseClass + '" data-toggle="switch">')
      .addClass(this.$element.prop('checked') ? '' : ' off');

    this.$element.wrap($switch);
    $.extend(this, {
      $switch: this.$element.parent(),
      $switchOn: $switchOn,
      $switchOff: $switchOff,
      $switchGroup: $switchGroup
    });
    this.$switch.append($switchGroup);

    this.update(true);
    this.trigger(true);
  };

  Switch.prototype.switch = function () {
    if (this.$element.prop('checked')) {
      this.off();
    } else {
      this.on();
    }
  };

  Switch.prototype.on = function (silent) {
    if (this.$element.prop('disabled')) return false;

    this.$switch.removeClass('off');
    this.$element.prop('checked', true);

    if (!silent) this.trigger();
  };

  Switch.prototype.off = function (silent) {
    if (this.$element.prop('disabled')) return false;

    this.$switch.addClass('off');
    this.$element.prop('checked', false);

    if (!silent) this.trigger();
  };

  Switch.prototype.enable = function () {
    this.$switch.removeAttr('disabled');
    this.$element.prop('disabled', false);
  };

  Switch.prototype.disable = function () {
    this.$switch.attr('disabled', 'disabled');
    this.$element.prop('disabled', true);
  };

  Switch.prototype.update = function (silent) {
    if (this.$element.prop('disabled')) {
      this.disable();
    } else {
      this.enable();
    }

    if (this.$element.prop('checked')) {
      this.on(silent);
    } else {
      this.off(silent);
    }
  };

  Switch.prototype.trigger = function (silent) {
    this.$element.off('change.bs.switch');

    if (!silent) this.$element.change();

    this.$element.on('change.bs.switch', $.proxy(function () {
      this.update();
    }, this));
  };

  // SWITCH PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.switch');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.switch', (data = new Switch(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.switch;

  $.fn.switch = Plugin;
  $.fn.switch.Constructor = Switch;

  // SWITCH NO CONFLICT
  // ==================

  $.fn.switch.noConflict = function () {
    $.fn.switch = old;
    return this;
  };

  // SWITCH DATA-API
  // ===============

  $(document)
    .on('ready.bs.switch.data-api', function () {
      var $this = $(this).find('[data-toggle="switch"]');
      if ($this.data('switch')) return;
      Plugin.call($this);
    })
    .on('click.bs.switch.data-api', '[data-toggle="switch"]', function () {
      var $this = $(this).find('input[type=checkbox]');
      if ($this.data('switch')) return;
      Plugin.call($this, 'switch');
    });

}(jQuery);
