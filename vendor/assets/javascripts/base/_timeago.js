+function ($) {
  'use strict';

  // TIMEAGO CLASS DEFINITION
  // ========================

  var Timeago = function (element, options) {
    this.$element = $(element);
    this.settings = {
      time: this.$element.data('time')
    };
    this.options = $.extend({}, Timeago.DEFAULTS, this.settings, options);

    this.$time = this.options.time;

    this.refresh();
  };

  Timeago.VERSION = '1.0.0';
  Timeago.DEFAULTS = {
    approximate: true,
    maxRelative: false,
    onRefreshCallback: function () {},
    showNow: false,
    showSeconds: false,
    spacing: true,
    text: {
      prefixes: {
        now: 'just now',
        lt: 'less than a',
        about: 'about',
        over: 'over',
        almost: 'almost',
        ago: ''
      },
      suffix: ' ago',
      units: {
        second: 'second',
        seconds: 'seconds',
        minute: 'minute',
        minutes: 'minutes',
        hour: 'hour',
        hours: 'hours',
        day: 'day',
        days: 'days',
        month: 'month',
        months: 'months',
        year: 'year',
        years: 'years'
      }
    }
  };

  Timeago.prototype.constructor = Timeago;

  Timeago.prototype.startTimer = function () {
    var _self = this;

    return this.interval = setTimeout(function () {
      return _self.refresh();
    }, this.startInterval);
  };

  Timeago.prototype.stopTimer = function () {
    return clearTimeout(this.interval);
  };

  Timeago.prototype.restartTimer = function () {
    this.stopTimer();
    return this.startTimer();
  };

  Timeago.prototype.refresh = function () {
    this.updateTime();
    $.event.trigger('bs.timeago.on-refresh');
    this.options.onRefreshCallback();
    return this.updateInterval();
  };

  Timeago.prototype.updateTime = function () {
    var timeStr = this.timeAgoInWords(this.$time);

    return this.$element.html(timeStr);
  };

  Timeago.prototype.updateInterval = function () {
    var newestTime = this.parseStr(this.$time);
    var distance = this.getTimeDistanceInSeconds(newestTime);

    if (this.options.maxRelative && distance >= this.options.maxRelative) {
      return this.stopTimer();
    } else if (this.options.showNow && distance < this.options.showNow) {
      this.startInterval = (this.options.showNow - distance) * 1000;
      return this.restartTimer();
    } else if (this.options.showSeconds && distance < 60) {
      this.startInterval = 1000;
      return this.restartTimer();
    } else if (distance < 2700) {
      this.startInterval = (60 - distance % 60) * 1000;
      return this.restartTimer();
    } else if (distance < 5400) {
      this.startInterval = (5400 - distance) * 1000;
      return this.restartTimer();
    } else if (distance < 151200) {
      this.startInterval = (3600 - distance % 3600) * 1000;
      return this.restartTimer();
    } else {
      this.startInterval = (86400 - distance % 86400) * 1000;
      return this.restartTimer();
    }
  };

  Timeago.prototype.timeAgoInWords = function (timeStr) {
    var absTime = this.parseStr(timeStr);
    var distance = this.getTimeDistanceInSeconds(absTime);

    if (this.options.showNow && this.options.showNow > distance) {
      return this.options.text.prefixes.now;
    } else if (this.options.maxRelative && this.options.maxRelative <= distance) {
      return timeStr;
    } else {
      return '' +
        this.options.text.prefixes.ago +
        this.distanceOfTimeInWords(distance) +
        this.options.text.suffix;
    }
  };

  Timeago.prototype.parseStr = function (iso8601) {
    var timeStr = $.trim(iso8601);

    timeStr = timeStr.replace(/\.\d+/, '');
    timeStr = timeStr.replace(/-/, '/').replace(/-/, '/');
    timeStr = timeStr.replace(/T/, ' ').replace(/Z/, ' UTC');
    timeStr = timeStr.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2');

    return new Date(timeStr);
  };

  Timeago.prototype.getTimeDistanceInSeconds = function (absTime) {
    var distance = new Date().getTime() - absTime.getTime();

    return Math.round(Math.abs(distance) / 1000);
  };

  Timeago.prototype.distanceOfTimeInWords = function (distance) {
    var about = this.options.approximate ? this.options.text.prefixes.about + ' ' : '';
    var space = this.options.spacing ? ' ' : '';

    if (distance < 60) {
      if (this.options.showSeconds) {
        if (distance === 0 || distance === 1) {
          return '1' +
            space +
            this.options.text.units.second;
        } else {
          return '' +
            distance +
            space +
            this.options.text.units.seconds;
        }
      } else {
        return '' +
          (this.options.approximate ? this.options.text.prefixes.lt + ' ' : '1' + space) +
          this.options.text.units.minute;
      }
    } else if (distance < 120) {
      return '1' +
        space +
        this.options.text.units.minute;
    } else if (distance < 2700) {
      return '' +
        (Math.round(distance / 60)) +
        space +
        this.options.text.units.minutes;
    } else if (distance < 5400) {
      return '' +
        about +
        '1' +
        space +
        this.options.text.units.hour;
    } else if (distance < 86400) {
      return '' +
        about +
        (Math.round(distance / 3600)) +
        space +
        this.options.text.units.hours;
    } else if (distance < 151200) {
      return '1' +
        space +
        this.options.text.units.day;
    } else if (distance < 2592000) {
      return '' +
        (Math.round(distance / 86400)) +
        space +
        this.options.text.units.days;
    } else if (distance < 5184000) {
      return '' +
        about +
        '1' +
        space +
        this.options.text.units.month;
    } else if (distance < 31536000) {
      return '' +
        (Math.round(distance / 2592000)) +
        space +
        this.options.text.units.months;
    } else if (distance < 39312000) {
      return '' +
        about +
        '1' +
        space +
        this.options.text.units.year;
    } else if (distance < 54864000) {
      return '' +
        about +
        '1' +
        space +
        this.options.text.units.year;
    } else if (distance < 63072000) {
      return '' +
        about +
        '2' +
        space +
        this.options.text.units.years;
    } else {
      return '' +
        about +
        (Math.round(distance / 31536000)) +
        space +
        this.options.text.units.years;
    }
  };

  // TIMEAGO PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.timeago');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.timeago', (data = new Timeago(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.timeago;

  $.fn.timeago = Plugin;
  $.fn.timeago.Constructor = Timeago;

  // TIMEAGO NO CONFLICT
  // ===================

  $.fn.timeago.noConflict = function () {
    $.fn.timeago = old;
    return this;
  };

  // TIMEAGO DATA-API
  // ================

  $(document).on('ready.bs.timeago.data-api', function () {
    $('[data-toggle="timeago"]').each(function () {
      var $this = $(this);
      if ($this.data('timeago')) return;
      Plugin.call($this, $this.data());
    });
  });

}(jQuery);
