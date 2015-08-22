(function() {
  var TimeAgo;

  TimeAgo = (function() {
    function TimeAgo(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, $.fn.timeago.defaults, options);
      this.refresh();
    }

    TimeAgo.prototype.startTimer = function() {
      return this.interval = setTimeout((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this), this.startInterval);
    };

    TimeAgo.prototype.stopTimer = function() {
      return clearTimeout(this.interval);
    };

    TimeAgo.prototype.restartTimer = function() {
      this.stopTimer();
      return this.startTimer();
    };

    TimeAgo.prototype.refresh = function() {
      this.updateTime();
      return this.updateInterval();
    };

    TimeAgo.prototype.updateTime = function() {
      var timeAgoInWords;
      timeAgoInWords = this.timeAgoInWords(this.$element.attr(this.options.attr));
      return this.$element.html(timeAgoInWords);
    };

    TimeAgo.prototype.updateInterval = function() {
      var dis, newestTime, newestTimeSrc;
      newestTimeSrc = this.$element.attr(this.options.attr);
      newestTime = this.parse(newestTimeSrc);
      dis = this.getTimeDistanceInSeconds(newestTime);
      if (this.options.maxRelative && dis >= this.options.maxRelative) {
        return this.stopTimer();
      } else if (this.options.showNow && dis < this.options.showNow) {
        this.startInterval = (this.options.showNow - dis) * 1000;
        return this.restartTimer();
      } else if (this.options.showSeconds && dis < 60) {
        this.startInterval = 1000;
        return this.restartTimer();
      } else if (dis < 2700) {
        this.startInterval = (60 - dis % 60) * 1000;
        return this.restartTimer();
      } else if (dis < 5400) {
        this.startInterval = (5400 - dis) * 1000;
        return this.restartTimer();
      } else if (dis < 151200) {
        this.startInterval = (3600 - dis % 3600) * 1000;
        return this.restartTimer();
      } else {
        this.startInterval = (86400 - dis % 86400) * 1000;
        return this.restartTimer();
      }
    };

    TimeAgo.prototype.timeAgoInWords = function(timeString) {
      var absolutTime, dis;
      absolutTime = this.parse(timeString);
      dis = this.getTimeDistanceInSeconds(absolutTime);
      if (this.options.showNow && this.options.showNow > dis) {
        return this.options.lang.prefixes.now;
      } else if (this.options.maxRelative && this.options.maxRelative <= dis) {
        return this.options.absoluteDate(absolutTime, timeString);
      } else {
        return this.options.relativeDate(this.options.lang.prefixes.ago, this.distanceOfTimeInWords(dis), this.options.suffix || this.options.lang.suffix);
      }
    };

    TimeAgo.prototype.parse = function(iso8601) {
      var timeStr;
      timeStr = $.trim(iso8601);
      timeStr = timeStr.replace(/\.\d+/, "");
      timeStr = timeStr.replace(/-/, "/").replace(/-/, "/");
      timeStr = timeStr.replace(/T/, " ").replace(/Z/, " UTC");
      timeStr = timeStr.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2");
      return new Date(timeStr);
    };

    TimeAgo.prototype.getTimeDistanceInSeconds = function(absolutTime) {
      var timeDistance;
      timeDistance = new Date().getTime() - absolutTime.getTime();
      return Math.round(Math.abs(timeDistance) / 1000);
    };

    TimeAgo.prototype.distanceOfTimeInWords = function(dis) {
      var space;
      space = this.options.spacing ? ' ' : '';
      if (dis < 60) {
        if (this.options.showSeconds) {
          if (dis === 0 || dis === 1) {
            return "1" + space + this.options.lang.units.second;
          } else {
            return "" + dis + space + this.options.lang.units.seconds;
          }
        } else {
          return "" + (this.options.approximate ? this.options.lang.prefixes.lt + " " : "1" + space) + this.options.lang.units.minute;
        }
      } else if (dis < 120) {
        return "1" + space + this.options.lang.units.minute;
      } else if (dis < 2700) {
        return "" + (Math.round(dis / 60)) + space + this.options.lang.units.minutes;
      } else if (dis < 5400) {
        return "" + (this.options.approximate ? this.options.lang.prefixes.about + " " : "") + "1" + space + this.options.lang.units.hour;
      } else if (dis < 86400) {
        return "" + (this.options.approximate ? this.options.lang.prefixes.about + " " : "") + (Math.round(dis / 3600)) + space + this.options.lang.units.hours;
      } else if (dis < 151200) {
        return "1" + space + this.options.lang.units.day;
      } else if (dis < 2592000) {
        return "" + (Math.round(dis / 86400)) + space + this.options.lang.units.days;
      } else if (dis < 5184000) {
        return "" + (this.options.approximate ? this.options.lang.prefixes.about + " " : "") + "1" + space + this.options.lang.units.month;
      } else if (dis < 31536000) {
        return "" + (Math.round(dis / 2592000)) + space + this.options.lang.units.months;
      } else if (dis < 39312000) {
        return "" + (this.options.approximate ? this.options.lang.prefixes.about + " " : "") + "1" + space + this.options.lang.units.year;
      } else if (dis < 54864000) {
        return "" + (this.options.approximate ? this.options.lang.prefixes.over + " " : "") + "1" + space + this.options.lang.units.year;
      } else if (dis < 63072000) {
        return "" + (this.options.approximate ? this.options.lang.prefixes.almost + " " : "") + "2" + space + this.options.lang.units.years;
      } else {
        return "" + (this.options.approximate ? this.options.lang.prefixes.about + " " : "") + (Math.round(dis / 31536000)) + space + this.options.lang.units.years;
      }
    };

    return TimeAgo;

  })();

  $.fn.timeago = function(options) {
    if (options == null) {
      options = {};
    }
    return this.each(function() {
      var $this, attr, data;
      $this = $(this);
      attr = $this.attr(options.attr || $.fn.timeago.defaults.attr);
      if (attr === void 0 || attr === false) {
        return;
      }
      data = $this.data("timeago");
      if (!data) {
        return $this.data("timeago", new TimeAgo(this, options));
      } else if (typeof options === 'string') {
        return data[options]();
      }
    });
  };

  $.fn.findAndSelf = function(selector) {
    return this.find(selector).add(this.filter(selector));
  };

  $.fn.timeago.Constructor = TimeAgo;

  $.fn.timeago.defaults = {
    attr: 'datetime',
    spacing: true,
    approximate: true,
    showSeconds: false,
    showNow: false,
    maxRelative: false,
    absoluteDate: function(date, datetime) {
      return datetime;
    },
    relativeDate: function(prefix, distance, suffix) {
      return "" + prefix + distance + suffix;
    },
    lang: {
      units: {
        second: "second",
        seconds: "seconds",
        minute: "minute",
        minutes: "minutes",
        hour: "hour",
        hours: "hours",
        day: "day",
        days: "days",
        month: "month",
        months: "months",
        year: "year",
        years: "years"
      },
      prefixes: {
        now: "just now",
        lt: "less than a",
        about: "about",
        over: "over",
        almost: "almost",
        ago: ""
      },
      suffix: ' ago'
    }
  };

}).call(this);