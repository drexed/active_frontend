+function ($) {
  'use strict';

  // TIMEPICKER PUBLIC CLASS DEFINITION
  // ==================================

  var Timepicker = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Timepicker.DEFAULTS, options);

    this.$active = false;
    this.$widget = $(this.initWidget()).on('click', $.proxy(this.clickWidget, this));

    this.init();
  };

  Timepicker.VERSION = '1.0.0';
  Timepicker.DEFAULTS = {
    menu: '<div class="timepicker dropmenu caret"></div>',
    meridian: true,
    onSetValCallback: function (value) {},
    seconds: false,
    step: 5,
    text: {
      am: 'am',
      pm: 'pm'
    },
    time: 'current'
  };

  Timepicker.prototype.constructor = Timepicker;

  Timepicker.prototype.init = function () {
    this.$element.on({
      'focus.bs.timepicker': $.proxy(this.showWidget, this),
      'click.bs.timepicker': $.proxy(this.showWidget, this),
      'blur.bs.timepicker': $.proxy(this.setVal, this)
    });

    this.setDefaultTime(this.options.time);
  };

  Timepicker.prototype.clickWidget = function (e) {
    e.stopPropagation();
    e.preventDefault();

    var $input = $(e.target);
    var action = $input.closest('a').data('action');

    if (action) this[action]();

    this.update();

    if ($input.is('input')) $input.get(0).setSelectionRange(0,2);
  };

  Timepicker.prototype.initWidget = function () {
    var contentTemplate = '<table>' +
       '<tr>' +
         '<td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td>' +
         '<td class="separator">&nbsp;</td>' +
         '<td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>' +
         (this.options.seconds ?
           '<td class="separator">&nbsp;</td>' +
           '<td><a href="#" data-action="incrementSecond"><i class="icon-chevron-up"></i></a></td>'
         : '') +
         (this.options.meridian ?
           '<td class="separator">&nbsp;</td>' +
           '<td class="meridian-column"><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>' :
           '') +
       '</tr>' +
       '<tr>' +
         '<td><span class="timepicker-hour"></span></td>' +
         '<td class="separator">:</td>' +
         '<td><span class="timepicker-minute"></span></td>' +
         (this.options.seconds ?
           '<td class="separator">:</td>' +
           '<td><span class="timepicker-second"></span></td>' :
           '') +
         (this.options.meridian ?
           '<td class="separator">&nbsp;</td>' +
           '<td><span class="timepicker-meridian"></span></td>' :
           '') +
       '</tr>' +
       '<tr>' +
         '<td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td>' +
         '<td class="separator"></td>' +
         '<td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>' +
         (this.options.seconds ?
           '<td class="separator">&nbsp;</td>' +
           '<td><a href="#" data-action="decrementSecond"><i class="icon-chevron-down"></i></a></td>' :
           '') +
         (this.options.meridian ?
          '<td class="separator">&nbsp;</td>' +
          '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>' :
          '') +
       '</tr>' +
     '</table>';

    return $(this.options.menu).html(contentTemplate);
  };

  Timepicker.prototype.showWidget = function () {
    if (this.$active) return;
    if (this.$element.prop('disabled') || this.$element.prop('readonly')) return;
    if (this.$widget.is(':visible')) return;

    this.$container = $('<span>')
      .addClass('btn-group dropdown open bsTimepicker')
      .css({
        height: 0,
        position: 'absolute',
        width: 0
      });

    this.$container.append(this.$widget);
    this.$element.after(this.$container);
    this.$active = true;

    var _self = this;
    $(document).on('mousedown.bs.timepicker, touchend.bs.timepicker', function (e) {
      if (!(_self.$element.parent().find(e.target).length ||
          _self.$widget.is(e.target) ||
          _self.$widget.find(e.target).length)) {
        _self.hideWidget();
      }
    });

    this.$element.trigger({
      type: 'show.bs.timepicker',
      time: {
        value: this.getTime(),
        hours: this.hour,
        minutes: this.minute,
        seconds: this.second,
        meridian: this.meridian
      }
    });

    if (this.hour === '') {
      if (this.options.time) {
        this.setDefaultTime(this.options.time);
      } else {
        this.setTime('0:0:0');
      }
    }
  };

  Timepicker.prototype.hideWidget = function () {
    if (!this.$active) return;
    if (!this.$widget.is(':visible')) return;

    this.$element.trigger({
      type: 'hide.bs.timepicker',
      time: {
        value: this.getTime(),
        hours: this.hour,
        minutes: this.minute,
        seconds: this.second,
        meridian: this.meridian
      }
    });

    $(document).off('mousedown.bs.timepicker, touchend.bs.timepicker');
    this.$widget.detach();
    this.$container.remove();
    this.$active = false;
  };

  Timepicker.prototype.getTime = function () {
    if (this.hour === '') return '';

    return this.hour +
      ':' +
      (this.minute.toString().length === 1 ? '0' + this.minute : this.minute) +
      (this.options.seconds ? ':' + (this.second.toString().length === 1 ? '0' + this.second : this.second) : '') +
      (this.options.meridian ? ' ' + this.meridian : '');
  };

  Timepicker.prototype.setDefaultTime = function (time) {
    if (!this.$element.val()) {
      if (time === 'current') {
        var dTime = new Date();
        var hours = dTime.getHours();
        var minutes = dTime.getMinutes();
        var seconds = dTime.getSeconds();
        var meridian = this.options.text.am;

        if (seconds !== 0) {
          seconds = Math.ceil(dTime.getSeconds() / this.options.step) * this.options.step;

          if (seconds === 60) {
            minutes += 1;
            seconds = 0;
          }
        }
        if (minutes !== 0) {
          minutes = Math.ceil(dTime.getMinutes() / this.options.step) * this.options.step;

          if (minutes === 60) {
            hours += 1;
            minutes = 0;
          }
        }
        if (this.options.meridian) {
          if (hours === 0) {
            hours = 12;
          } else if (hours >= 12) {
            if (hours > 12) {
              hours = hours - 12;
            }
            meridian = this.options.text.pm;
          } else {
            meridian = this.options.text.am;
          }
        }

        this.hour = hours;
        this.minute = minutes;
        this.second = seconds;
        this.meridian = meridian;

        this.update();

      } else if (time === false) {
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.meridian = this.options.text.am;
      } else {
        this.setTime(time);
      }
    } else {
      this.setVal();
    }
  };

  Timepicker.prototype.setTime = function (time, ignoreWidget) {
    if (!time) {
      this.clear();
      return;
    }

    var timeArray, hour, minute, second, meridian;

    if (typeof time === 'object' && time.getMonth){
      hour = time.getHours();
      minute = time.getMinutes();
      second = time.getSeconds();

      if (this.options.meridian){
        meridian = this.options.text.am;

        if (hour > 12){
          meridian = this.options.text.pm;
          hour = hour % 12;
        }
        if (hour === 12){
          meridian = this.options.text.pm;
        }
      }
    } else {
      if (time.match(/p/i) !== null) {
        meridian = this.options.text.pm;
      } else {
        meridian = this.options.text.am;
      }

      time = time.replace(/[^0-9\:]/g, '');
      timeArray = time.split(':');

      hour = timeArray[0] ? timeArray[0].toString() : timeArray.toString();
      minute = timeArray[1] ? timeArray[1].toString() : '';
      second = timeArray[2] ? timeArray[2].toString() : '';

      if (hour.length > 4) {
        second = hour.substr(4, 2);
      }
      if (hour.length > 2) {
        minute = hour.substr(2, 2);
        hour = hour.substr(0, 2);
      }
      if (minute.length > 2) {
        second = minute.substr(2, 2);
        minute = minute.substr(0, 2);
      }
      if (second.length > 2) {
        second = second.substr(2, 2);
      }

      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);
      second = parseInt(second, 10);

      if (isNaN(hour)) {
        hour = 0;
      }
      if (isNaN(minute)) {
        minute = 0;
      }
      if (isNaN(second)) {
        second = 0;
      }
      if (this.options.meridian) {
        if (hour < 1) {
          hour = 1;
        } else if (hour > 12) {
          hour = 12;
        }
      } else {
        if (hour >= 24) {
          hour = 23;
        } else if (hour < 0) {
          hour = 0;
        }
        if (hour < 13 && meridian === this.options.text.pm) {
          hour = hour + 12;
        }
      }
      if (minute < 0) {
        minute = 0;
      } else if (minute >= 60) {
        minute = 59;
      }
      if (this.options.seconds) {
        if (isNaN(second)) {
          second = 0;
        } else if (second < 0) {
          second = 0;
        } else if (second >= 60) {
          second = 59;
        }
      }
    }

    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.meridian = meridian;

    this.update(ignoreWidget);
  };

  Timepicker.prototype.setVal = function () {
    var value = this.$element.val();

    this.setTime(value);
    $.event.trigger({
      type: 'bs.timepicker.on-set-val',
      value: value
    });
    this.options.onSetValCallback(value);
  };

  Timepicker.prototype.clear = function () {
    this.hour = '';
    this.minute = '';
    this.second = '';
    this.meridian = '';

    this.$element.val('');
  };

  Timepicker.prototype.toggleMeridian = function () {
    this.meridian = this.meridian === this.options.text.am ?
      this.options.text.pm :
      this.options.text.am;
  };

  Timepicker.prototype.decrementHour = function () {
    if (this.options.meridian) {
      if (this.hour === 1) {
        this.hour = 12;
      } else if (this.hour === 12) {
        this.hour--;
        return this.toggleMeridian();
      } else if (this.hour === 0) {
        this.hour = 11;
        return this.toggleMeridian();
      } else {
        this.hour--;
      }
    } else {
      if (this.hour <= 0) {
        this.hour = 23;
      } else {
        this.hour--;
      }
    }
  };

  Timepicker.prototype.decrementMinute = function (step) {
    var newVal;

    if (step) {
      newVal = this.minute - step;
    } else {
      newVal = this.minute - this.options.step;
    }

    if (newVal < 0) {
      this.decrementHour();
      this.minute = newVal + 60;
    } else {
      this.minute = newVal;
    }
  };

  Timepicker.prototype.decrementSecond = function () {
    var newVal = this.second - this.options.step;

    if (newVal < 0) {
      this.decrementMinute(true);
      this.second = newVal + 60;
    } else {
      this.second = newVal;
    }
  };

  Timepicker.prototype.incrementHour = function () {
    if (this.options.meridian) {
      if (this.hour === 11) {
        this.hour++;
        return this.toggleMeridian();
      } else if (this.hour === 12) {
        this.hour = 0;
      }
    }
    if (this.hour === 23) {
      this.hour = 0;
      return;
    }

    this.hour++;
  };

  Timepicker.prototype.incrementMinute = function (step) {
    var newVal;

    if (step) {
      newVal = this.minute + step;
    } else {
      newVal = this.minute + this.options.step - (this.minute % this.options.step);
    }
    if (newVal > 59) {
      this.incrementHour();
      this.minute = newVal - 60;
    } else {
      this.minute = newVal;
    }
  };

  Timepicker.prototype.incrementSecond = function () {
    var newVal = this.second + this.options.step - (this.second % this.options.step);

    if (newVal > 59) {
      this.incrementMinute(true);
      this.second = newVal - 60;
    } else {
      this.second = newVal;
    }
  };

  Timepicker.prototype.update = function (ignoreWidget) {
    this.updateElement();

    if (!ignoreWidget) this.updateWidget();

    this.$element.trigger({
      type: 'change.bs.timepicker',
      time: {
        value: this.getTime(),
        hours: this.hour,
        minutes: this.minute,
        seconds: this.second,
        meridian: this.meridian
      }
    });
  };

  Timepicker.prototype.updateElement = function () {
    this.$element
      .val(this.getTime())
      .change();
  };

  Timepicker.prototype.updateWidget = function () {
    if (this.$widget === false) return;

    var hour = this.hour;
    var minute = this.minute.toString().length === 1 ? '0' + this.minute : this.minute;
    var second = this.second.toString().length === 1 ? '0' + this.second : this.second;

    this.$widget.find('span.timepicker-hour').text(hour);
    this.$widget.find('span.timepicker-minute').text(minute);

    if (this.options.seconds) this.$widget.find('span.timepicker-second').text(second);
    if (this.options.meridian) this.$widget.find('span.timepicker-meridian').text(this.meridian);
  };

  Timepicker.prototype.updateFromWidgetInputs = function () {
    if (this.$widget === false) return;

    var time = this.$widget.find('input.timepicker-hour').val() +
      ':' +
      this.$widget.find('input.timepicker-minute').val() +
      (this.options.seconds ? ':' + this.$widget.find('input.timepicker-second').val() : '') +
      (this.options.meridian ? this.$widget.find('input.timepicker-meridian').val() : '');

    this.setTime(time, true);
  };

  // TIMEPICKER PLUGIN DEFINITION
  // ============================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.timepicker');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.timepicker', (data = new Timepicker(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.timepicker;

  $.fn.timepicker = Plugin;
  $.fn.timepicker.Constructor = Timepicker;

  // TIMEPICKER NO CONFLICT
  // ======================

  $.fn.timepicker.noConflict = function () {
    $.fn.timepicker = old;
    return this;
  };

  // TIMEPICKER DATA-API
  // ===================

  $(document).on('focus.bs.timepicker.data-api click.bs.timepicker.data-api', '[data-toggle="timepicker"]', function (e) {
    var $this = $(this);
    if ($this.data('timepicker')) return;
    Plugin.call($this, $this.data());
  });

}(jQuery);
