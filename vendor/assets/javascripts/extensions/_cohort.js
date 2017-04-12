;(function(globals) {
  var TYPE_PERCENTAGE = 'percentage';
  var TYPE_ABSOLUTE = 'absolute';

  var cohortDefaults = {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'
    ],
    shortMonthNames: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    repeatLevels: {
      'low': [0, 10],
      'medium-low': [10, 20],
      'medium': [20, 30],
      'medium-high': [30, 40],
      'high': [40, 60],
      'hot': [60, 70],
      'extra-hot': [70, 100]
    },
    labels: {
      time: 'Time',
      total: 'Total',
      weekOf: 'Week of'
    },
    emptyPlaceholder: '---',
    timeInterval: 'monthly',
    drawEmptyCells: true,
    rawNumberOnHover: true,
    initialIntervalNumber: 1,
    percentagePercision: 1,
    classPrefix: 'cohort-',

    formatHeaderLabel: function(i) {
      return (this.initialIntervalNumber - 1 + i).toString();
    },
    formatDailyLabel: function(date, i) {
      date.setDate(date.getDate() + i);
      return this.monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + getYear(date);
    },
    formatWeeklyLabel: function(date, i) {
      date.setDate(date.getDate() + i * 7);
      return this.labels.weekOf + ' ' + this.shortMonthNames[date.getMonth()] + ' ' +
              date.getDate() + ', ' + getYear(date);
    },
    formatMonthlyLabel: function(date, i) {
      date.setMonth(date.getMonth() + i);
      return this.monthNames[date.getMonth()] + ' ' + getYear(date);
    },
    formatYearlyLabel: function(date, i) {
      return date.getYear() + 1900 + i;
    }
  },

  defaults = cohortDefaults;

  function extend() {
    var target = arguments[0];

    if (arguments.length === 1) return target;

    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var prop in source) target[prop] = source[prop];
    }

    return target;
  }

  function isNumber(val) {
    return Object.prototype.toString.call(val) === '[object Number]';
  }

  function isEmpty(val) {
    return val === null || val === undefined || val === '';
  }

  function getYear(date) {
    return date.getFullYear ? date.getFullYear() : date.getYear() + 1900;
  }

  function formatValue(value, base, valueType) {
    if (valueType === TYPE_ABSOLUTE) {
      return value;
    } else if (isNumber(value) && base > 0) {
      return (value / base * 100).toFixed(cohortDefaults.percentagePercision);
    } else if (isNumber(value)) {
      return '0.00';
    }
  }

  function setText(element, text) {
    if (document.all) {
      element.innerText = text;
    } else {
      element.textContent = text;
    }
  }

  function setTitle(element, text, type) {
    if (type === TYPE_ABSOLUTE) {
      element.dataset.originalTitle = text;
    } else {
      element.dataset.originalTitle = text + '%';
    }
  }

  function addClass(element, className) {
    if (!new RegExp(className).test(element.className)) {
      element.className += ' ' + className;
    }
  }

  function removeClass(element, className) {
    element.className = element.className.replace(className, '');
  }

  function prefixClass(className, classPrefix) {
    var prefixedClass = [],
        classes = className.split(/\s+/);

    for (var i in classes) {
      prefixedClass.push(classPrefix + classes[i]);
    }

    return prefixedClass.join(' ');
  }

  var draw = function(cohort, values, container) {
    if (!values)    throw new Error ('Please provide the values data');
    if (!container) throw new Error ('Please provide the values container');

    var config = cohort.config,
        initialDate = cohort.initialDate;

    function create(el, options) {
      options = options || {};

      el = document.createElement(el);

      if ((className = options.className)) {
        delete options.className;
        el.className = prefixClass(className, config.classPrefix);
      }

      if (!isEmpty(options.text)) {
        var text = options.text.toString();
        setText(el, text);
        delete options.text;
      }

      if (options.tooltip) {
        el.dataset.hover = 'tooltip';
        el.dataset.container = 'body';
        delete options.tooltip;
      }

      for (var option in options) {
        if ((opt = options[option])) el[option] = opt;
      }

      return el;
    }

    function drawHeader(data) {
      var th = create('tr'),
          monthLength = data[0].length;

      th.appendChild(create('th', { text: config.labels.time, className: 'time' }));

      for (var i = 0; i < monthLength; i++) {
        if (i > config.maxColumns) break;
        var text = i === 0 ? config.labels.total : config.formatHeaderLabel(i);
        th.appendChild(create('th', { text: text, className: 'total' }));
      }

      return th;
    }

    function formatTimeLabel(initial, timeInterval, i) {
      var date = new Date(initial.getTime()),
          formatFn = null;

      if (timeInterval === 'daily') {
          formatFn = 'formatDailyLabel';
      } else if (timeInterval === 'weekly') {
          formatFn = 'formatWeeklyLabel';
      } else if (timeInterval === 'monthly') {
          formatFn = 'formatMonthlyLabel';
      } else if (timeInterval === 'yearly') {
          formatFn = 'formatYearlyLabel';
      } else {
          throw new Error('Interval not supported');
      }

      return config[formatFn].call(config, date, i);
    }

    function drawCells(data) {
      var fragment = document.createDocumentFragment(),
          startMonth = config.maxRows ? data.length - config.maxRows : 0,
          classNameFor = function(value) {
            var levels = config.repeatLevels,
                floatValue = value && parseFloat(value),
                highestLevel = null,
                classNames = ['percentage'];

            for (var level in levels) {
              if (floatValue >= levels[level][0] && floatValue < levels[level][1]) {
                classNames.push(level);
                return classNames.join(' ');
              }

              highestLevel = level;
            }

            classNames.push(highestLevel);
            return classNames.join(' ');
          };

      for (var i = startMonth; i < data.length; i++) {
        var tr = create('tr'),
            row = data[i],
            baseValue = row[0];

        tr.appendChild(create('td', {
          className: 'label',
          text: formatTimeLabel(initialDate, config.timeInterval, i)
        }));

        for (var j = 0; j < data[0].length; j++) {
          if (j > config.maxColumns) break;

          var value = row[j],
              cellValue = j === 0 ? value : formatValue(value, baseValue, TYPE_PERCENTAGE),
              opts = {};

          if (!isEmpty(cellValue)) {
            var title = j > 0 && config.rawNumberOnHover ? value : null;

            opts = {
              text: cellValue,
              title: title,
              className: j === 0 ? 'total' : classNameFor(cellValue),
              tooltip: title !== null
            };
          } else if (config.drawEmptyCells) {
            opts = { text: config.emptyPlaceholder, className: 'empty' };
          }

          tr.appendChild(create('td', opts));
        }

        fragment.appendChild(tr);
      }

      return fragment;
    }

    var mainContainer = create('div', { className: 'container' }),
        table = create('table', { className: 'table' });

    table.appendChild(drawHeader(values));
    table.appendChild(drawCells(values));

    if ((title = config.title)) {
      mainContainer.appendChild(create('div', { text: title, className: 'title' }));
    }

    mainContainer.appendChild(table);

    container.innerHTML = '';
    container.appendChild(mainContainer);
  };

  var Cohort = function(opts) {
    if (!(initialDate = opts.initialDate)) throw new Error('The initialDate is a required argument');
    delete opts.initialDate;

    this.initialDate = initialDate;
    this.valueType = TYPE_PERCENTAGE;
    this.config = extend({}, Cohort.getDefaults(), opts || {});

    this.toggleValues = function() {
      this.valueType = this.valueType === TYPE_PERCENTAGE ? TYPE_ABSOLUTE : TYPE_PERCENTAGE;
      var table = opts.container.getElementsByTagName('table')[0];

      for (var rowIndex = 0; rowIndex < opts.values.length; rowIndex++) {
        var tr = table.children[rowIndex + 1];

        for (var cellIndex = 1; cellIndex < opts.values[rowIndex].length; cellIndex++) {
          var td = tr.children[cellIndex + 1];
          var absValue = formatValue(opts.values[rowIndex][cellIndex], opts.values[rowIndex][0], TYPE_ABSOLUTE);
          var perValue = formatValue(opts.values[rowIndex][cellIndex], opts.values[rowIndex][0], TYPE_PERCENTAGE);

          if (this.valueType === TYPE_ABSOLUTE) {
            setText(td, absValue);
            setTitle(td, perValue, TYPE_PERCENTAGE);
            removeClass(td, prefixClass('percentage', this.config.classPrefix));
          } else {
            setText(td, perValue);
            setTitle(td, absValue, TYPE_ABSOLUTE);
            addClass(td, prefixClass('percentage', this.config.classPrefix));
          }
        }
      }
    };
  };

  extend(Cohort, {
    getDefaults: function() {
      return defaults;
    },
    setDefaults: function(def) {
      defaults = extend({}, cohortDefaults, def);
    },
    resetDefaults: function() {
      defaults = cohortDefaults;
    },
    draw: function(options) {
      var cohort = new Cohort(options);
      draw(cohort, options.values, options.container);
      return cohort;
    }
  });

  if (typeof jQuery !== 'undefined' && jQuery !== null) {
    jQuery.fn.cohort = function(options) {
      return this.each(function() {
        options.container = this;
        return Cohort.draw(options);
      });
    };
  }

  if (globals.exports) {
    globals.exports = Cohort;
  } else {
    globals.Cohort = Cohort;
  }
})(typeof module === 'function' ? module : window);
