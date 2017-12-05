+function ($) {
  'use strict';

  // DATEPICKER PUBLIC CLASS DEFINITION
  // ==================================

  var Datepicker = function (element, options) {
    this.$element = $(element);
    this.$element.data('datepicker', this);
    this.settings = {
      endDate: this.$element.data('end-date') || Datepicker.DEFAULTS.endDate,
      forceParse: this.$element.data('force-parse') || Datepicker.DEFAULTS.forceParse,
      format: this.$element.data('format') || Datepicker.DEFAULTS.format,
      multidate: this.$element.data('multidate') || Datepicker.DEFAULTS.multidate,
      startDate: this.$element.data('start-date') || Datepicker.DEFAULTS.startDate
    };
    this.options = $.extend({}, Datepicker.DEFAULTS, this.settings, options);

    this.$allowUpdate = true;

    this.updateOptions(options);

    this.$dates = new DateArray();
    this.$viewDate = this.$Options.defaultViewDate;
    this.$widget = $(this.initWidget());

    this.addTemplateArrows();
    this.buildEvents();
    this.unapplyEvents(this.$events);
    this.applyEvents(this.$events);

    this.$viewMode = this.$Options.startView;
    this.$allowUpdate = false;

    this.setStartDate(this.$Options.startDate);
    this.setEndDate(this.$Options.endDate);
    this.setDaysOfWeekDisabled(this.$Options.daysOfWeekDisabled);
    this.setDaysOfWeekHighlighted(this.$Options.daysOfWeekHighlighted);
    this.setDatesDisabled(this.$Options.datesDisabled);
    this.fillDays();
    this.fillMonths();

    this.$allowUpdate = true;

    this.update();
    this.updateWidgetMode();
  };

  Datepicker.VERSION = '1.0.0';
  Datepicker.DEFAULTS = {
    assumeNearbyYear: false,
    calendarWeeks: false,
    datesDisabled: [],
    daysOfWeekDisabled: [],
    daysOfWeekHighlighted: [],
    endDate: Infinity,
    forceParse: true,
    format: 'yyyy-mm-dd',
    maxViewMode: 2,
    menu: '<div class="datepicker dropmenu caret"></div>',
    minViewMode: 0,
    multidate: false,
    multidateSeparator: ',',
    onSetValCallback: function (value) {},
    startDate: -Infinity,
    startView: 0,
    templates: {
      leftArrow: '<i class="icon-chevron-left"></i>',
      rightArrow: '<i class="icon-chevron-right"></i>'
    },
    text: {
      titleFormat: 'MM yyyy',
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      daysMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
      months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    },
    toggleActive: false,
    weekStart: 0
  };

  Datepicker.prototype.constructor = Datepicker;

  Datepicker.prototype.updateOptions = function (options) {
    this.$Options = $.extend({}, this.options, options);

    this.$Options.startView = this.resolveViewName(this.$Options.startView, 0);
    this.$Options.minViewMode = this.resolveViewName(this.$Options.minViewMode, 0);
    this.$Options.maxViewMode = this.resolveViewName(this.$Options.maxViewMode, 4);
    this.$Options.startView = Math.min(this.$Options.startView, this.$Options.maxViewMode);
    this.$Options.startView = Math.max(this.$Options.startView, this.$Options.minViewMode);

    if (this.$Options.multidate !== true) {
      this.$Options.multidate = Number(this.$Options.multidate) || false;

      if (this.$Options.multidate !== false) {
        this.$Options.multidate = Math.max(0, this.$Options.multidate);
      }
    }

    this.$Options.multidateSeparator = String(this.$Options.multidateSeparator);
    this.$Options.weekStart %= 7;
    this.$Options.weekEnd = (this.$Options.weekStart + 6) % 7;

    var format = this.parseFormat(this.$Options.format);

    if (this.$Options.startDate !== -Infinity) {
      if (!!this.$Options.startDate) {
        if (this.$Options.startDate instanceof Date) {
          this.$Options.startDate = this.localToUtc(this.zeroTime(this.$Options.startDate));
        } else {
          this.$Options.startDate = this.parseDate(this.$Options.startDate, format, this.$Options.assumeNearbyYear);
        }
      } else {
        this.$Options.startDate = -Infinity;
      }
    }
    if (this.$Options.endDate !== Infinity) {
      if (!!this.$Options.endDate) {
        if (this.$Options.endDate instanceof Date) {
          this.$Options.endDate = this.localToUtc(this.zeroTime(this.$Options.endDate));
        } else {
          this.$Options.endDate = this.parseDate(this.$Options.endDate, format, this.$Options.assumeNearbyYear);
        }
      } else {
        this.$Options.endDate = Infinity;
      }
    }

    this.$Options.daysOfWeekDisabled = this.$Options.daysOfWeekDisabled || [];

    if (!$.isArray(this.$Options.daysOfWeekDisabled)) {
      this.$Options.daysOfWeekDisabled = this.$Options.daysOfWeekDisabled.split(/[,\s]*/);
    }

    this.$Options.daysOfWeekDisabled = $.map(this.$Options.daysOfWeekDisabled, function (date) {
      return parseInt(date, 10);
    });

    this.$Options.daysOfWeekHighlighted = this.$Options.daysOfWeekHighlighted || [];

    if (!$.isArray(this.$Options.daysOfWeekHighlighted)) {
      this.$Options.daysOfWeekHighlighted = this.$Options.daysOfWeekHighlighted.split(/[,\s]*/);
    }

    this.$Options.daysOfWeekHighlighted = $.map(this.$Options.daysOfWeekHighlighted, function (date) {
      return parseInt(date, 10);
    });

    this.$Options.datesDisabled = this.$Options.datesDisabled || [];

    if (!$.isArray(this.$Options.datesDisabled)) {
      this.$Options.datesDisabled = [this.$Options.datesDisabled];
    }

    this.$Options.datesDisabled = $.map(this.$Options.datesDisabled,function (date) {
      return this.parseDate(date, format, this.$Options.assumeNearbyYear);
    });

    if (this.$Options.defaultViewDate) {
      var year = this.$Options.defaultViewDate.year || new Date().getFullYear();
      var month = this.$Options.defaultViewDate.month || 0;
      var day = this.$Options.defaultViewDate.day || 1;

      this.$Options.defaultViewDate = this.utcDate(year, month, day);
    } else {
      this.$Options.defaultViewDate = this.utcToday();
    }
  };

  Datepicker.prototype.resolveViewName = function (view, value) {
    if (view === 0 || view === 'days' || view === 'month') return 0;
    if (view === 1 || view === 'months' || view === 'year') return 1;
    if (view === 2 || view === 'years' || view === 'decade') return 2;
    if (view === 3 || view === 'decades' || view === 'century') return 3;
    if (view === 4 || view === 'centuries' || view === 'millennium') return 4;

    return value === undefined ? false : value;
  };

  Datepicker.prototype.checkTemplate = function (tmp) {
    try {
      if (tmp === undefined || tmp === '') return false;
      if ((tmp.match(/[<>]/g) || []).length <= 0) return true;

      return $(tmp).length > 0;
    } catch (e) {
      return false;
    }
  };

  Datepicker.prototype.buildEvents = function () {
    this.$events = [
      [this.$element, {
        'focus.bs.datepicker': $.proxy(this.showWidget, this),
        'click.bs.datepicker': $.proxy(this.showWidget, this)
      }]
    ];

    this.$eventsAlt = [
      [this.$widget, {
        'click.bs.datepicker': $.proxy(this.clickWidget, this)
      }],
      [$(document), {
        'mousedown.bs.datepicker, touchend.bs.datepicker': $.proxy(function (e) {
          if (!(
            this.$element.is(e.target) ||
            this.$element.find(e.target).length ||
            this.$widget.is(e.target) ||
            this.$widget.find(e.target).length
          )) {
            this.hideWidget();
          }
        }, this)
      }]
    ];
  };

  Datepicker.prototype.applyEvents = function (evs) {
    for (var i = 0, el, ch, ev; i < evs.length; i++) {
      el = evs[i][0];

      if (evs[i].length === 2) {
        ch = undefined;
        ev = evs[i][1];
      } else if (evs[i].length === 3) {
        ch = evs[i][1];
        ev = evs[i][2];
      }

      el.on(ev, ch);
    }
  };

  Datepicker.prototype.unapplyEvents = function (evs) {
    for (var i = 0, el, ev, ch; i < evs.length; i++) {
      el = evs[i][0];

      if (evs[i].length === 2) {
        ch = undefined;
        ev = evs[i][1];
      } else if (evs[i].length === 3) {
        ch = evs[i][1];
        ev = evs[i][2];
      }

      el.off(ev, ch);
    }
  };

  Datepicker.prototype.utcToLocal = function (utc) {
    return utc && new Date(utc.getTime() + (utc.getTimezoneOffset() * 60000));
  };

  Datepicker.prototype.localToUtc = function (local) {
    return local && new Date(local.getTime() - (local.getTimezoneOffset() * 60000));
  };

  Datepicker.prototype.zeroTime = function (local) {
    return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
  };

  Datepicker.prototype.zeroUtcTime = function (utc) {
    return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
  };

  Datepicker.prototype.getDates = function () {
    return $.map(this.$dates, this.utcToLocal);
  };

  Datepicker.prototype.getUTCDates = function () {
    return $.map(this.$dates, function (date) {
      return new Date(date);
    });
  };

  Datepicker.prototype.getDate = function () {
    return this.utcToLocal(this.getUTCDate());
  };

  Datepicker.prototype.getUTCDate = function () {
    var selected_date = this.$dates.get(-1);

    if (typeof(selected_date) !== 'undefined') {
      return new Date(selected_date);
    } else {
      return null;
    }
  };

  Datepicker.prototype.setVal = function () {
    var value = this.getFormattedDate();

    this.$element.val(value);
    $.event.trigger({
      type: 'bs.datepicker.on-set-val',
      value: value
    });
    this.options.onSetValCallback(value);
  };

  Datepicker.prototype.setDate = function (date, which) {
    if (!which || which === 'date') this.toggleMultidate(date && new Date(date));
    if (!which || which === 'view') this.$viewDate = date && new Date(date);

    this.fill();
    this.setVal();

    if (!which || which !== 'view') this.triggerEvent('changeDate');
    if (this.$element) this.$element.change();
    if (!which || which === 'date') this.hideWidget();
  };

  Datepicker.prototype.clearDates = function () {
    if (this.$element) this.$element.val('');

    this.update();
    this.triggerEvent('changeDate');
    this.hideWidget();
  };

  Datepicker.prototype.getFormattedDate = function (format) {
    if (format === undefined) {
      format = this.$Options.format;
    }

    var _self = this;
    return $.map(this.$dates, function (date) {
      return _self.formatDate(date, format);
    }).join(this.$Options.multidateSeparator);
  };

  Datepicker.prototype.setUTCDate = function () {
    var args = $.isArray(arguments[0]) ? arguments[0] : arguments;

    this.update.apply(this, $.map(args, this.utcToLocal));
    this.triggerEvent('changeDate');
    this.setVal();
  };

  Datepicker.prototype.updateAll = function () {
    this.update();
    this.updateWidgetArrows();
  };

  Datepicker.prototype.setStartDate = function (startDate) {
    this.updateOptions({ 'startDate': startDate });
    this.updateAll();
  };

  Datepicker.prototype.setEndDate = function (endDate) {
    this.updateOptions({ 'endDate': endDate });
    this.updateAll();
  };

  Datepicker.prototype.setDaysOfWeekDisabled = function (daysOfWeekDisabled) {
    this.updateOptions({ 'daysOfWeekDisabled': daysOfWeekDisabled });
    this.updateAll();
  };

  Datepicker.prototype.setDaysOfWeekHighlighted = function (daysOfWeekHighlighted) {
    this.updateOptions({ 'daysOfWeekHighlighted': daysOfWeekHighlighted });
    this.updateAll();
  };

  Datepicker.prototype.setDatesDisabled = function (datesDisabled) {
    this.updateOptions({ 'datesDisabled': datesDisabled });
    this.updateAll();
  };

  Datepicker.prototype.setRange = function (range) {
    if (!range || !range.length) {
      delete this.$range;
    } else {
      this.$range = $.map(range, function (date) {
        return date.valueOf();
      });
    }

    this.fill();
  };

  Datepicker.prototype.moveDay = function (date, dir) {
    var newDate = new Date(date);

    newDate.setUTCDate(date.getUTCDate() + dir);

    return newDate;
  };

  Datepicker.prototype.moveWeek = function (date, dir) {
    return this.moveDay(date, dir * 7);
  };

  Datepicker.prototype.moveMonth = function (date, dir) {
    if (!this.isValidDate(date)) return this.$Options.defaultViewDate;
    if (!dir) return date;

    var newMonth, test;
    var newDate = new Date(date.valueOf());
    var day = newDate.getUTCDate();
    var month = newDate.getUTCMonth();
    var mag = Math.abs(dir);

    dir = dir > 0 ? 1 : -1;

    if (mag === 1) {
      test = dir === -1 ? function () {
        return newDate.getUTCMonth() === month;
      } : function () {
        return newDate.getUTCMonth() !== newMonth;
      };

      newMonth = month + dir;
      newDate.setUTCMonth(newMonth);

      if (newMonth < 0 || newMonth > 11) {
        newMonth = (newMonth + 12) % 12;
      }
    } else {
      for (var i = 0; i < mag; i++) {
        newDate = this.moveMonth(newDate, dir);
        newMonth = newDate.getUTCMonth();
        newDate.setUTCDate(day);
      }

      test = function () {
        return newMonth !== newDate.getUTCMonth();
      };
    } while (test()) {
      newDate.setUTCDate(--day);
      newDate.setUTCMonth(newMonth);
    }

    return newDate;
  };

  Datepicker.prototype.moveYear = function (date, dir) {
    return this.moveMonth(date, dir * 12);
  };

  Datepicker.prototype.moveAvailableDate = function (date, dir, fn) {
    do {
      date = this[fn](date, dir);

      if (!this.dateWithinRange(date)) return false;

      fn = 'moveDay';
    } while (this.dateIsDisabled(date));

    return date;
  };

  Datepicker.prototype.weekOfDateIsDisabled = function (date) {
    return $.inArray(date.getUTCDay(), this.$Options.daysOfWeekDisabled) !== -1;
  };

  Datepicker.prototype.dateIsDisabled = function (date) {
    return this.weekOfDateIsDisabled(date) ||
      $.grep(this.$Options.datesDisabled, function (d) {
        return this.isUTCEquals(date, d);
      }).length > 0;
  };

  Datepicker.prototype.dateWithinRange = function (date) {
    return date >= this.$Options.startDate && date <= this.$Options.endDate;
  };

  Datepicker.prototype.toggleMultidate = function (date) {
    var ix = this.$dates.contains(date);

    if (!date) this.$dates.clear();

    if (ix !== -1) {
      if (this.$Options.multidate === true || this.$Options.multidate > 1 || this.$Options.toggleActive) {
        this.$dates.remove(ix);
      }
    } else if (this.$Options.multidate === false) {
      this.$dates.clear();
      this.$dates.push(date);
    } else {
      this.$dates.push(date);
    }

    if (typeof this.$Options.multidate === 'number') {
      while (this.$dates.length > this.$Options.multidate) this.$dates.remove(0);
    }
  };

  Datepicker.prototype.getClassNames = function (date) {
    var cls = [];
    var year = this.$viewDate.getUTCFullYear();
    var month = this.$viewDate.getUTCMonth();
    var today = new Date();

    if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)) {
      cls.push('old');
    } else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)) {
      cls.push('new');
    }

    if (date.getUTCFullYear() === today.getFullYear() &&
      date.getUTCMonth() === today.getMonth() &&
      date.getUTCDate() === today.getDate()) {
      cls.push('today');
    }

    if (this.$dates.contains(date) !== -1) cls.push('active');
    if (!this.dateWithinRange(date)) cls.push('disabled');
    if (this.dateIsDisabled(date)) cls.push('disabled', 'disabled-date');
    if ($.inArray(date.getUTCDay(), this.$Options.daysOfWeekHighlighted) !== -1) cls.push('highlighted');

    if (this.$range) {
      if (date > this.$range[0] && date < this.$range[this.$range.length-1]) cls.push('range');
      if ($.inArray(date.valueOf(), this.$range) !== -1) cls.push('selected');
      if (date.valueOf() === this.$range[0]) cls.push('range-start');
      if (date.valueOf() === this.$range[this.$range.length-1]) cls.push('range-end');
    }

    return cls;
  };

  Datepicker.prototype.fill = function () {
    var date = new Date(this.$viewDate);
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth();

    if (isNaN(year) || isNaN(month)) return;

    var startYear = this.$Options.startDate !== -Infinity ? this.$Options.startDate.getUTCFullYear() : -Infinity;
    var startMonth = this.$Options.startDate !== -Infinity ? this.$Options.startDate.getUTCMonth() : -Infinity;
    var endYear = this.$Options.endDate !== Infinity ? this.$Options.endDate.getUTCFullYear() : Infinity;
    var endMonth = this.$Options.endDate !== Infinity ? this.$Options.endDate.getUTCMonth() : Infinity;
    var titleFormat = this.$Options.text.titleFormat;

    this.$widget
      .find('.datepicker-days .datepicker-switch')
      .text(this.formatDate(date, titleFormat));

    this.updateWidgetArrows();
    this.fillMonths();

    var prevMonth = this.utcDate(year, month - 1, 28);
    var day = this.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());

    prevMonth.setUTCDate(day);
    prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.$Options.weekStart + 7) % 7);

    var nextMonth = new Date(prevMonth);

    if (prevMonth.getUTCFullYear() < 100) nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());

    nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
    nextMonth = nextMonth.valueOf();

    var html = [];
    var clsName;

    while (prevMonth.valueOf() < nextMonth) {
      if (prevMonth.getUTCDay() === this.$Options.weekStart) {
        html.push('<tr>');

        if (this.$Options.calendarWeeks) {
          var ws = new Date(+prevMonth + (this.$Options.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5);
          var th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5);
          var yth = new Date(Number(yth = this.utcDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5);
          var calWeek =  (th - yth) / 864e5 / 7 + 1;

          html.push('<td class="cw">'+ calWeek +'</td>');
        }
      }

      clsName = this.getClassNames(prevMonth);
      clsName.push('day');

      clsName = $.unique(clsName);
      html.push('<td class="' + clsName.join(' ') + '">' + prevMonth.getUTCDate() + '</td>');

      if (prevMonth.getUTCDay() === this.$Options.weekEnd) html.push('</tr>');

      prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
    }

    this.$widget
      .find('.datepicker-days tbody')
      .empty()
      .append(html.join(''));

    var monthsTitle = this.$Options.text.monthsTitle || 'Months';
    var months = this.$widget
      .find('.datepicker-months')
      .find('.datepicker-switch')
      .text(this.$Options.maxViewMode < 2 ? monthsTitle : year)
      .end()
      .find('span')
      .removeClass('active');

    $.each(this.$dates, function (i, date) {
      if (date.getUTCFullYear() === year) months.eq(date.getUTCMonth()).addClass('active');
    });

    if (year < startYear || year > endYear) months.addClass('disabled');
    if (year === startYear) months.slice(0, startMonth).addClass('disabled');
    if (year === endYear) months.slice(endMonth + 1).addClass('disabled');

    this.fillYears('.datepicker-years', 'year', 10, 1, year, startYear, endYear);
    this.fillYears('.datepicker-decades', 'decade', 100, 10, year, startYear, endYear);
    this.fillYears('.datepicker-centuries', 'century', 1000, 100, year, startYear, endYear);
  };

  Datepicker.prototype.fillDays = function () {
    var dayCount = this.$Options.weekStart;
    var html = '<tr>';

    if (this.$Options.calendarWeeks) {
      this.$widget
        .find('.datepicker-days .datepicker-switch')
        .attr('colspan', function (i, val) {
          return parseInt(val) + 1;
        });

      html += '<th class="cw">&#160;</th>';
    }

    while (dayCount < this.$Options.weekStart + 7) {
      html += '<th class="dow';

      if ($.inArray(dayCount, this.$Options.daysOfWeekDisabled) > -1) {
        html += ' disabled';
      }

      html += '">' + this.$Options.text.daysMin[(dayCount++) % 7] + '</th>';
    }

    html += '</tr>';
    this.$widget.find('.datepicker-days thead').append(html);
  };

  Datepicker.prototype.fillMonths = function () {
    var localDate = this.utcToLocal(this.$viewDate);
    var html = '';
    var i = 0;

    while (i < 12) {
      var focused = localDate && localDate.getMonth() === i ? ' focused' : '';

      html += '<span class="month' + focused + '">' + this.$Options.text.monthsShort[i++] + '</span>';
    }

    this.$widget.find('.datepicker-months td').html(html);
  };

  Datepicker.prototype.fillYears = function (selector, cssClass, factor, step, currentYear, startYear, endYear) {
    var year = parseInt(currentYear / factor, 10) * factor;
    var startStep = parseInt(startYear / step, 10) * step;
    var endStep = parseInt(endYear / step, 10) * step;
    var view = this.$widget.find(selector);
    var steps = $.map(this.$dates, function (date) {
      return parseInt(date.getUTCFullYear() / step, 10) * step;
    });
    var thisYear = year - step;
    var html = '';
    var i, classes;

    view.find('.datepicker-switch').text(year + '-' + (year + step * 9));

    for (i = -1; i < 11; i += 1) {
      classes = [cssClass];

      if (i === -1) {
        classes.push('old');
      } else if (i === 10) {
        classes.push('new');
      }

      if ($.inArray(thisYear, steps) !== -1) classes.push('active');
      if (thisYear < startStep || thisYear > endStep) classes.push('disabled');
      if (thisYear === this.$viewDate.getFullYear()) classes.push('focused');

      html += '<span class="' + classes.join(' ') + '">' + thisYear + '</span>';
      thisYear += step;
    }

    view.find('td').html(html);
  };

  Datepicker.prototype.update = function () {
    if (!this.$allowUpdate) return;

    var dates = [];
    var oldDates = this.$dates.copy();
    var fromArgs = false;

    if (arguments.length) {
      $.each(arguments, $.proxy(function (i, date) {
        if (date instanceof Date) {
          date = this.localToUtc(date);
        }

        dates.push(date);
      }, this));

      fromArgs = true;
    } else {
      dates = this.$element.val();

      if (dates && this.$Options.multidate) {
        dates = dates.split(this.$Options.multidateSeparator);
      } else {
        dates = [dates];
      }

      delete this.$element.data().date;
    }

    dates = $.map(dates, $.proxy(function (date) {
      return this.parseDate(date, this.$Options.format, this.$Options.assumeNearbyYear);
    }, this));

    dates = $.grep(dates, $.proxy(function (date) {
      return !this.dateWithinRange(date) || !date;
    }, this), true);

    this.$dates.replace(dates);

    if (this.$dates.length) {
      this.$viewDate = new Date(this.$dates.get(-1));
    } else if (this.$viewDate < this.$Options.startDate) {
      this.$viewDate = new Date(this.$Options.startDate);
    } else if (this.$viewDate > this.$Options.endDate) {
      this.$viewDate = new Date(this.$Options.endDate);
    } else {
      this.$viewDate = this.$Options.defaultViewDate;
    }

    if (fromArgs) {
      this.setVal();
    } else if (dates.length) {
      if (String(oldDates) !== String(this.$dates)) this.triggerEvent('changeDate');
    }

    if (!this.$dates.length && oldDates.length) this.triggerEvent('clearDate');

    this.fill();
    this.$element.change();
  };

  Datepicker.prototype.triggerEvent = function (event, altDate) {
    var date = altDate || this.$dates.get(-1);
    var localDate = this.utcToLocal(date);

    this.$element.trigger({
      type: event,
      date: localDate,
      dates: $.map(this.$dates, this.utcToLocal),
      format: $.proxy(function (ix, format) {
        if (arguments.length === 0) {
          ix = this.$dates.length - 1;
          format = this.$Options.format;
        } else if (typeof(ix) === 'string') {
          format = ix;
          ix = this.$dates.length - 1;
        }

        return this.formatDate(this.$dates.get(ix), format || this.$Options.format);
      }, this)
    });
  };

  Datepicker.prototype.showWidget = function () {
    if (this.$element.prop('disabled') || this.$element.prop('readonly')) return;
    if (this.$widget.is(':visible')) return;

    this.$container = $('<span>')
      .addClass('btn-group dropdown open bsDatepicker')
      .css({
        height: 0,
        position: 'absolute',
        width: 0
      });

    this.$container.append(this.$widget);
    this.$element.after(this.$container);

    this.unapplyEvents(this.$eventsAlt);
    this.applyEvents(this.$eventsAlt);
    this.triggerEvent('showWidget');
  };

  Datepicker.prototype.clickWidget = function (e) {
    e.preventDefault();
    e.stopPropagation();

    var dir, day, year, month, monthChanged, yearChanged;
    var target = $(e.target);

    if (target.hasClass('datepicker-switch')) this.updateWidgetMode(1);

    var navArrow = target.closest('.prev, .next');

    if (navArrow.length > 0) {
      dir = this.modes(this.$viewMode).navStep * (navArrow.hasClass('prev') ? -1 : 1);

      if (this.$viewMode === 0) {
        this.$viewDate = this.moveMonth(this.$viewDate, dir);
        this.triggerEvent('changeMonth', this.$viewDate);
      } else {
        this.$viewDate = this.moveYear(this.$viewDate, dir);

        if (this.$viewMode === 1) this.triggerEvent('changeYear', this.$viewDate);
      }

      this.fill();
    }

    if (!target.hasClass('disabled')) {
      if (target.hasClass('day')) {
        day = parseInt(target.text(), 10) || 1;
        year = this.$viewDate.getUTCFullYear();
        month = this.$viewDate.getUTCMonth();

        if (target.hasClass('old')) {
          if (month === 0) {
            month = 11;
            year = year - 1;
            monthChanged = true;
            yearChanged = true;
          } else {
            month = month - 1;
            monthChanged = true;
          }
        }
        if (target.hasClass('new')) {
          if (month === 11) {
            month = 0;
            year = year + 1;
            monthChanged = true;
            yearChanged = true;
          } else {
            month = month + 1;
            monthChanged = true;
          }
        }

        this.setDate(this.utcDate(year, month, day));

        if (yearChanged) this.triggerEvent('changeYear', this.$viewDate);
        if (monthChanged) this.triggerEvent('changeMonth', this.$viewDate);
      }

      if (target.hasClass('month')) {
        this.$viewDate.setUTCDate(1);

        day = 1;
        month = target.parent().find('span').index(target);
        year = this.$viewDate.getUTCFullYear();

        this.$viewDate.setUTCMonth(month);
        this.triggerEvent('changeMonth', this.$viewDate);

        if (this.$Options.minViewMode === 1) {
          this.setDate(this.utcDate(year, month, day));
          this.updateWidgetMode();
        } else {
          this.updateWidgetMode(-1);
        }

        this.fill();
      }

      if (target.hasClass('year') || target.hasClass('decade') || target.hasClass('century')) {
        this.$viewDate.setUTCDate(1);

        day = 1;
        month = 0;
        year = parseInt(target.text(), 10) || 0;

        this.$viewDate.setUTCFullYear(year);

        if (target.hasClass('year')) {
          this.triggerEvent('changeYear', this.$viewDate);
          if (this.$Options.minViewMode === 2) this.setDate(this.utcDate(year, month, day));
        }
        if (target.hasClass('decade')) {
          this.triggerEvent('changeDecade', this.$viewDate);
          if (this.$Options.minViewMode === 3) this.setDate(this.utcDate(year, month, day));
        }
        if (target.hasClass('century')) {
          this.triggerEvent('changeCentury', this.$viewDate);
          if (this.$Options.minViewMode === 4) this.setDate(this.utcDate(year, month, day));
        }

        this.updateWidgetMode(-1);
        this.fill();
      }
    }
  };

  Datepicker.prototype.updateWidgetArrows = function () {
    if (!this.$allowUpdate) return;

    var date = new Date(this.$viewDate);
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth();
    var prev = this.$widget.find('.prev');
    var next = this.$widget.find('.next');
    var hiddenCss = { visibility: 'hidden' };
    var visibleCss = { visibility: 'visible' };

    switch (this.$viewMode) {
      case 0:
        if (this.$Options.startDate !== -Infinity && year <= this.$Options.startDate.getUTCFullYear() && month <= this.$Options.startDate.getUTCMonth()) {
          prev.css(hiddenCss);
        } else {
          prev.css(visibleCss);
        }
        if (this.$Options.endDate !== Infinity && year >= this.$Options.endDate.getUTCFullYear() && month >= this.$Options.endDate.getUTCMonth()) {
          next.css(hiddenCss);
        } else {
          next.css(visibleCss);
        }

        break;
      case 1:
      case 2:
      case 3:
      case 4:
        if (this.$Options.startDate !== -Infinity && year <= this.$Options.startDate.getUTCFullYear() || this.$Options.maxViewMode < 2) {
          prev.css(hiddenCss);
        } else {
          prev.css(visibleCss);
        }
        if (this.$Options.endDate !== Infinity && year >= this.$Options.endDate.getUTCFullYear() || this.$Options.maxViewMode < 2) {
          next.css(hiddenCss);
        } else {
          next.css(visibleCss);
        }

        break;
    }
  };

  Datepicker.prototype.updateWidgetMode = function (dir) {
    if (dir) {
      this.$viewMode = Math.max(this.$Options.minViewMode, Math.min(this.$Options.maxViewMode, this.$viewMode + dir));
    }

    this.$widget
      .children('div')
      .hide()
      .filter('.datepicker-' + this.modes(this.$viewMode).clsName)
      .show();

    this.updateWidgetArrows();
  };

  Datepicker.prototype.hideWidget = function () {
    if (!this.$widget.is(':visible')) return;

    this.unapplyEvents(this.$eventsAlt);
    this.$viewMode = this.$Options.startView;

    if (this.$Options.forceParse) this.setVal();

    this.updateWidgetMode();
    this.$widget.detach();
    this.$container.remove();
    this.triggerEvent('hideWidget');
  };

  Datepicker.prototype.addTemplateArrows = function (view, value) {
    if (this.checkTemplate(this.$Options.templates.leftArrow)) {
      this.$widget.find('.prev').html(this.$Options.templates.leftArrow);
    }
    if (this.checkTemplate(this.$Options.templates.rightArrow)) {
      this.$widget.find('.next').html(this.$Options.templates.rightArrow);
    }
  };

  Datepicker.prototype.templateContainer = function (klass) {
    var table = $('<table>')
      .append(this.templateHeader())
      .append(this.templateBody(klass));
    var container = $('<div class="' + klass + '">')
      .append(table);

    return container;
  };

  Datepicker.prototype.templateHeader = function () {
    var row = $('<tr>')
      .append('<th class="prev">' + this.$Options.templates.leftArrow + '</th>')
      .append('<th colspan="5" class="datepicker-switch"></th>')
      .append('<th class="next">' + this.$Options.templates.rightArrow + '</th>');
    var header = $('<thead>')
      .append(row);

    return header;
  };

  Datepicker.prototype.templateBody = function (klass) {
    var body = $('<tbody>');
    if (klass !== 'datepicker-days') body.append('<tr><td colspan="7"></td></tr>');
    return body;
  };

  Datepicker.prototype.initWidget = function () {
    var menu = $(this.$Options.menu)
      .append(this.templateContainer('datepicker-days'))
      .append(this.templateContainer('datepicker-months'))
      .append(this.templateContainer('datepicker-years'))
      .append(this.templateContainer('datepicker-decades'))
      .append(this.templateContainer('datepicker-centuries'));

    return menu;
  };

  Datepicker.prototype.modes = function (mode) {
    var modes = [
      { clsName: 'days', navFnc: 'Month', navStep: 1 },
      { clsName: 'months', navFnc: 'FullYear', navStep: 1 },
      { clsName: 'years', navFnc: 'FullYear', navStep: 10 },
      { clsName: 'decades', navFnc: 'FullDecade', navStep: 100 },
      { clsName: 'centuries', navFnc: 'FullCentury', navStep: 1000 }
    ];

    return modes[mode];
  };

  Datepicker.prototype.formatDate = function (date, format) {
    if (!date) return '';
    if (typeof format === 'string') format = this.parseFormat(format);

    var seps = $.extend([], format.separators);
    var val = {
      d: date.getUTCDate(),
      D: this.$Options.text.daysShort[date.getUTCDay()],
      DD: this.$Options.text.days[date.getUTCDay()],
      m: date.getUTCMonth() + 1,
      M: this.$Options.text.monthsShort[date.getUTCMonth()],
      MM: this.$Options.text.months[date.getUTCMonth()],
      yy: date.getUTCFullYear().toString().substring(2),
      yyyy: date.getUTCFullYear()
    };

    val.dd = (val.d < 10 ? '0' : '') + val.d;
    val.mm = (val.m < 10 ? '0' : '') + val.m;

    date = [];

    for (var i = 0, cnt = format.parts.length; i <= cnt; i++) {
      if (seps.length) date.push(seps.shift());

      date.push(val[format.parts[i]]);
    }

    return date.join('');
  };

  Datepicker.prototype.getDaysInMonth = function (year, month) {
    return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  };

  Datepicker.prototype.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
  };

  Datepicker.prototype.parseFormat = function (format) {
    var regex = /dd?|DD?|mm?|MM?|yy(?:yy)?/g;
    var separators = format.replace(regex, '\0').split('\0');
    var parts = format.match(regex);

    if (!separators || !separators.length || !parts || parts.length === 0) {
      throw new Error('Invalid date format.');
    }

    return { separators: separators, parts: parts };
  };

  Datepicker.prototype.parseDate = function (date, format, assumeNearby) {
    if (!date) return undefined;
    if (date instanceof Date) return date;

    if (typeof format === 'string') {
      format = this.parseFormat(format);
    }

    var part, dir, i, fn;
    var partRe = /([\-+]\d+)([dmwy])/;
    var parts = date.match(/([\-+]\d+)([dmwy])/g);
    var fnMap = { d: 'moveDay', m: 'moveMonth', w: 'moveWeek', y: 'moveYear' };
    var dateAliases = { yesterday: '-1d', today: '+0d', tomorrow: '+1d' };

    if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
      date = new Date();

      for (i = 0; i < parts.length; i++) {
        part = partRe.exec(parts[i]);
        dir = parseInt(part[1]);
        fn = fnMap[part[2]];
        date = Datepicker.prototype[fn](date, dir);
      }

      return this.utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }

    if (typeof dateAliases[date] !== 'undefined') {
      date = dateAliases[date];
      parts = date.match(/([\-+]\d+)([dmwy])/g);

      if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
        date = new Date();

        for (i = 0; i < parts.length; i++) {
          part = partRe.exec(parts[i]);
          dir = parseInt(part[1]);
          fn = fnMap[part[2]];
          date = Datepicker.prototype[fn](date, dir);
        }

        return this.utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      }
    }

    parts = date && date.match(/[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g) || [];
    date = new Date();

    function applyNearbyYear(year, threshold) {
      if (threshold === true) threshold = 10;

      if (year < 100) {
        year += 2000;

        if (year > ((new Date()).getFullYear()+threshold)) {
          year -= 100;
        }
      }

      return year;
    }

    var val, filtered;
    var parsed = {};
    var setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'];
    var setters_map = {
      yyyy: function (d,v) {
        return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
      },
      yy: function (d,v) {
        return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
      },
      m: function (d,v) {
        if (isNaN(d)) return d;

        v -= 1;
        while (v < 0) v += 12;
        v %= 12;

        d.setUTCMonth(v);
        while (d.getUTCMonth() !== v) d.setUTCDate(d.getUTCDate()-1);

        return d;
      },
      d: function (d,v) {
        return d.setUTCDate(v);
      }
    };

    setters_map.M = setters_map.MM = setters_map.mm = setters_map.m;
    setters_map.dd = setters_map.d;

    date = this.utcToday();

    var fparts = format.parts.slice();

    if (parts.length !== fparts.length) {
      fparts = $(fparts).filter(function (i, p) {
        return $.inArray(p, setters_order) !== -1;
      }).toArray();
    }

    function match_part() {
      var m = this.slice(0, parts[i].length);
      var p = parts[i].slice(0, m.length);

      return m.toLowerCase() === p.toLowerCase();
    }

    if (parts.length === fparts.length) {
      var cnt, _date, s;

      for (i = 0, cnt = fparts.length; i < cnt; i++) {
        val = parseInt(parts[i], 10);
        part = fparts[i];

        if (isNaN(val)) {
          switch (part) {
            case 'MM':
              filtered = $(this.text.months).filter(match_part);
              val = $.inArray(filtered[0], this.text.months) + 1;
              break;

            case 'M':
              filtered = $(this.text.monthsShort).filter(match_part);
              val = $.inArray(filtered[0], this.text.monthsShort) + 1;
              break;
          }
        }

        parsed[part] = val;
      }

      for (i = 0; i < setters_order.length; i++) {
        s = setters_order[i];

        if (s in parsed && !isNaN(parsed[s])) {
          _date = new Date(date);
          setters_map[s](_date, parsed[s]);

          if (!isNaN(_date)) {
            date = _date;
          }
        }
      }
    }

    return date;
  };

  Datepicker.prototype.utcDate = function () {
    return new Date(Date.UTC.apply(Date, arguments));
  };

  Datepicker.prototype.utcToday = function () {
    var today = new Date();
    return this.utcDate(today.getFullYear(), today.getMonth(), today.getDate());
  };

  Datepicker.prototype.isUTCEquals = function (date1, date2) {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate();
  };

  Datepicker.prototype.isValidDate = function (date) {
    return date && !isNaN(date.getTime());
  };

  // DATERANGEPICKER PUBLIC CLASS DEFINITION
  // =======================================

  var DateRangepicker = function (element, options) {
    this.$element = $(element);
    this.$element.data('datepicker', this);
    this.options = $.extend({}, Datepicker.DEFAULTS, options);

    this.parseInputs();

    delete this.options.inputs;

    this.proxyUpdate();
    this.getRangePickers();
    this.updateDates();
  };

  DateRangepicker.prototype.constructor = DateRangepicker;

  DateRangepicker.prototype.proxyUpdate = function () {
    Plugin.call($(this.$inputs), this.options)
      .on('changeDate', $.proxy(this.dateUpdated, this));
  };

  DateRangepicker.prototype.parseInputs = function () {
    this.$inputs = $.map(this.options.inputs, function (input) {
      return input.jquery ? input[0] : input;
    });
  };

  DateRangepicker.prototype.getRangePickers = function () {
    this.$pickers = $.map(this.$inputs, function (input) {
      return $(input).data('datepicker');
    });
  };

  DateRangepicker.prototype.updateDates = function () {
    this.$dates = $.map(this.$pickers, function (picker) {
      return picker.getUTCDate();
    });

    this.updateRanges();
  };

  DateRangepicker.prototype.updateRanges = function () {
    var range = $.map(this.$dates, function (date) {
      return date.valueOf();
    });

    $.each(this.$pickers, function (i, picker) {
      picker.setRange(range);
    });
  };

  DateRangepicker.prototype.dateUpdated = function (e) {
    if (this.$active) return;

    this.$active = true;

    var picker = $(e.target).data('datepicker');

    if (typeof(picker) === 'undefined') return;

    var i = $.inArray(e.target, this.$inputs);

    if (i === -1) return;

    var date = picker.getUTCDate();
    var j = i - 1;
    var k = i + 1;
    var l = this.$inputs.length;

    $.each(this.$pickers, function (i, p) {
      if (!p.getUTCDate()) p.setUTCDate(date);
    });

    if (date < this.$dates[j]) {
      while (j >= 0 && date < this.$dates[j]) this.$pickers[j--].setUTCDate(date);
    } else if (date > this.$dates[k]) {
      while (k < l && date > this.$dates[k]) this.$pickers[k++].setUTCDate(date);
    }

    this.updateDates();

    delete this.$active;
  };

  var DateArray = (function () {
    var extras = {
      get: function (i) {
        return this.slice(i)[0];
      },
      contains: function (date) {
        var val = date && date.valueOf();

        for (var i = 0, l = this.length; i < l; i++) {
          if (this[i].valueOf() === val) return i;
        }

        return -1;
      },
      remove: function (i) {
        this.splice(i, 1);
      },
      replace: function (array) {
        if (!array) return;
        if (!$.isArray(array)) array = [array];

        this.clear();
        this.push.apply(this, array);
      },
      clear: function () {
        this.length = 0;
      },
      copy: function () {
        var array = new DateArray();
        array.replace(this);
        return array;
      }
    };

    return function () {
      var array = [];
      array.push.apply(array, arguments);
      $.extend(array, extras);
      return array;
    };
  })();

  // DATEPICKER PLUGIN DEFINITION
  // ============================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.datepicker');
      var options = typeof option === 'object' && option;

      if (!data) {
        if ($this.hasClass('datepicker-range')) {
          $.extend(options, {
            inputs: $this.find('input').toArray(),
          });

          $this.data('bs.datepicker', (data = new DateRangepicker(this, options)));
        } else {
          $this.data('bs.datepicker', (data = new Datepicker(this, options)));
        }
      }

      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.datepicker;

  $.fn.datepicker = Plugin;
  $.fn.datepicker.Constructor = Datepicker;

  // DATEPICKER NO CONFLICT
  // ======================

  $.fn.datepicker.noConflict = function () {
    $.fn.datepicker = old;
    return this;
  };

  // DATEPICKER DATA-API
  // ===================

  $(document).on('focus.bs.datepicker.data-api click.bs.datepicker.data-api', '[data-toggle="datepicker"]', function (e) {
    var $this = $(this);
    if ($this.data('datepicker')) return;
    Plugin.call($this, $this.data());
  });

}(jQuery);
