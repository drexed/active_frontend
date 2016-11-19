+function ($) {
  'use strict';

  // TIMEZONE CLASS DEFINITION
  // =========================

  var Timezone = function (element, options) {
    this.$element = $(element);
    this.settings = {
      default: this.$element.data('default'),
      format: this.$element.data('format')
    };
    this.options = $.extend({}, Timezone.DEFAULTS, this.settings, options);

    this.init();
  };

  Timezone.VERSION = '1.0.0';
  Timezone.DEFAULTS = {
    default: 'America/New_York',
    format: 'olson',
    timezones: {
      '-12': 'Pacific/Kwajalein',
      '-11': 'Pacific/Samoa',
      '-10': 'Pacific/Honolulu',
      '-9': 'America/Juneau',
      '-8': 'America/Los_Angeles',
      '-7': 'America/Denver',
      '-6': 'America/Mexico_City',
      '-5': 'America/New_York',
      '-4': 'America/Caracas',
      '-3.5': 'America/St_Johns',
      '-3': 'America/Argentina/Buenos_Aires',
      '-2': 'Atlantic/Azores',
      '-1': 'Atlantic/Azores',
      '0': 'Etc/UTC',
      '1': 'Europe/Paris',
      '2': 'Europe/Helsinki',
      '3': 'Europe/Moscow',
      '3.5': 'Asia/Tehran',
      '4': 'Asia/Baku',
      '4.5': 'Asia/Kabul',
      '5': 'Asia/Karachi',
      '5.5': 'Asia/Calcutta',
      '6': 'Asia/Colombo',
      '7': 'Asia/Bangkok',
      '8': 'Asia/Singapore',
      '9': 'Asia/Tokyo',
      '9.5': 'Australia/Darwin',
      '10': 'Pacific/Guam',
      '11': 'Asia/Magadan',
      '12': 'Asia/Kamchatka'
    }
  };

  Timezone.prototype.constructor = Timezone;

  Timezone.prototype.init = function () {
    var timezone = this.getTimezone();

    if (this.$element.data('toggle') == 'timezone') {
      this.$element.val(timezone);
    } else  {
      return timezone;
    }
  };

  Timezone.prototype.getTimezone = function () {
    var offset = (new Date()).getTimezoneOffset();
    if (offset === 'undefined') return this.options.default;

    offset = -offset / 60;
    if (offset === 'undefined') return this.options.default;

    return this.options.timezones[offset];
  };

  Timezone.prototype.formatTimezone = function () {
    var timezone = this.getTimezone();

    switch (this.options.format) {
      case 'region':
        return timezone.split('/')[0];
      case 'city':
        return timezone.split('/')[1];
      default:
        return timezone;
    }
  };

  // TIMEZONE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.timezone');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.timezone', (data = new Timezone(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.timezone;

  $.fn.timezone = Plugin;
  $.fn.timezone.Constructor = Timezone;

  // TIMEZONE NO CONFLICT
  // ====================

  $.fn.timezone.noConflict = function () {
    $.fn.timezone = old;
    return this;
  };

  // TIMEZONE DATA-API
  // =================

  $(document).on('ready.bs.timezone.data-api', function () {
    $('[data-toggle="timezone"]').each(function () {
      var $this = $(this);
      if ($this.data('timezone')) return;
      Plugin.call($this, $this.data());
    });
  });

}(jQuery);
