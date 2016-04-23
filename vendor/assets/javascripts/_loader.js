;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Loader = factory();
  }

})(this, function() {
  var Loader = {};

  Loader.version = '0.1.6';

  var Settings = Loader.settings = {
    minimum: 0.08,
    easing: 'ease',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="loader-backdrop"><div class="loader-bar" role="bar"><div class="loader-peg"></div></div><div class="loader-spinner" role="spinner"><div class="loader-spinner-icon"></div></div></div>'
  };

  Loader.configure = function(options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
    }

    return this;
  };

  Loader.status = null;

  Loader.set = function(n) {
    var started = Loader.isStarted();

    n = clamp(n, Settings.minimum, 1);
    Loader.status = (n === 1 ? null : n);

    var progress = Loader.render(!started),
        bar      = progress.querySelector(Settings.barSelector),
        speed    = Settings.speed,
        ease     = Settings.easing;

    progress.offsetWidth;

    queue(function(next) {
      if (Settings.positionUsing === '') Settings.positionUsing = Loader.getPositioningCSS();

      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        css(progress, {
          transition: 'none',
          opacity: 1
        });
        progress.offsetWidth;

        setTimeout(function() {
          css(progress, {
            transition: 'all ' + speed + 'ms linear',
            opacity: 0
          });
          setTimeout(function() {
            Loader.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  };

  Loader.isStarted = function() {
    return typeof Loader.status === 'number';
  };

  Loader.start = function() {
    if (!Loader.status) Loader.set(0);

    var work = function() {
      setTimeout(function() {
        if (!Loader.status) return;
        Loader.trickle();
        work();
      }, Settings.trickleSpeed);
    };

    if (Settings.trickle) work();

    return this;
  };

  Loader.done = function(force) {
    if (!force && !Loader.status) return this;

    return Loader.inc(0.3 + 0.5 * Math.random()).set(1);
  };

  Loader.inc = function(amount) {
    var n = Loader.status;

    if (!n) {
      return Loader.start();
    } else {
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return Loader.set(n);
    }
  };

  Loader.trickle = function() {
    return Loader.inc(Math.random() * Settings.trickleRate);
  };

  (function() {
    var initial = 0, current = 0;

    Loader.promise = function($promise) {
      if (!$promise || $promise.state() == "resolved") {
        return this;
      }

      if (current == 0) {
        Loader.start();
      }

      initial++;
      current++;

      $promise.always(function() {
        current--;
        if (current == 0) {
            initial = 0;
            Loader.done();
        } else {
            Loader.set((initial - current) / initial);
        }
      });

      return this;
    };

  })();

  Loader.render = function(fromStart) {
    if (Loader.isRendered()) return document.getElementById('loader');

    addClass(document.documentElement, 'loader-busy');

    var progress = document.createElement('div');
    progress.id = 'loader';
    progress.innerHTML = Settings.template;

    var bar      = progress.querySelector(Settings.barSelector),
        perc     = fromStart ? '-100' : toBarPerc(Loader.status || 0),
        parent   = document.querySelector(Settings.parent),
        spinner;

    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    if (!Settings.showSpinner) {
      spinner = progress.querySelector(Settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'loader-custom-parent');
    }

    parent.appendChild(progress);
    return progress;
  };

  Loader.remove = function() {
    removeClass(document.documentElement, 'loader-busy');
    removeClass(document.querySelector(Settings.parent), 'loader-custom-parent')
    var progress = document.getElementById('loader');
    progress && removeElement(progress);
  };

  Loader.isRendered = function() {
    return !!document.getElementById('loader');
  };

  Loader.getPositioningCSS = function() {
    var bodyStyle = document.body.style;

    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
                       ('MozTransform' in bodyStyle) ? 'Moz' :
                       ('msTransform' in bodyStyle) ? 'ms' :
                       ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      return 'translate';
    } else {
      return 'margin';
    }
  };

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  function toBarPerc(n) {
    return (-1 + n) * 100;
  }

  function barPositionCSS(n, speed, ease) {
    var barCSS;

    if (Settings.positionUsing === 'translate3d') {
      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
    } else if (Settings.positionUsing === 'translate') {
      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
    } else {
      barCSS = { 'margin-left': toBarPerc(n)+'%' };
    }

    barCSS.transition = 'all '+speed+'ms '+ease;

    return barCSS;
  }

  var queue = (function() {
    var pending = [];

    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function(fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  var css = (function() {
    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
          capName = name.charAt(0).toUpperCase() + name.slice(1),
          vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function(element, properties) {
      var args = arguments,
          prop,
          value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    }
  })();

  function hasClass(element, name) {
    var list = typeof element == 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  }

  function addClass(element, name) {
    var oldList = classList(element),
        newList = oldList + name;

    if (hasClass(oldList, name)) return;

    element.className = newList.substring(1);
  }

  function removeClass(element, name) {
    var oldList = classList(element),
        newList;

    if (!hasClass(element, name)) return;

    newList = oldList.replace(' ' + name + ' ', ' ');

    element.className = newList.substring(1, newList.length - 1);
  }
  function classList(element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  }

  function removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }

  return Loader;
});

jQuery(function() {
  jQuery(document).on('ajaxStart', function() { Loader.start(); });
  jQuery(document).on('ajaxStop',  function() { Loader.done();  });
});

$(function() {
  $(document).on('page:fetch',   function() { Loader.start();  });
  $(document).on('page:receive', function() { Loader.set(0.7); });
  $(document).on('page:change',  function() { Loader.done();   });
  $(document).on('page:restore', function() { Loader.remove(); });
  $(document).on('pjax:send',     function() { Loader.start(); });
  $(document).on('pjax:complete', function() { Loader.done();  });
});
