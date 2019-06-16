;(function ($) {
  'use strict';

  var combinators = [' ', '>', '+', '~'];
  var fraternisers = ['+', '~'];
  var complexTypes = ['ATTR', 'PSEUDO', 'ID', 'CLASS'];
  var msobservers = [];

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }

  function grok(msobserver) {
    if (!$.find.tokenize) {
      msobserver.isCombinatorial = true;
      msobserver.isFraternal = true;
      msobserver.isComplex = true;
      return;
    }

    msobserver.isCombinatorial = false;
    msobserver.isFraternal = false;
    msobserver.isComplex = false;

    var token = $.find.tokenize(msobserver.selector);

    for (var i = 0; i < token.length; i++) {
      for (var j = 0; j < token[i].length; j++) {
        if (combinators.indexOf(token[i][j].type) != -1) msobserver.isCombinatorial = true;
        if (fraternisers.indexOf(token[i][j].type) != -1) msobserver.isFraternal = true;
        if (complexTypes.indexOf(token[i][j].type) != -1) msobserver.isComplex = true;
      }
    }
  }

  var MutationSelectorObserver = function (selector, callback, options) {
    this.selector = selector.trim();
    this.callback = callback;
    this.options = options;

    grok(this);
  };

  msobservers.initialize = function (selector, callback, options) {
    var seen = [];
    var callbackOnce = function () {
        if (seen.indexOf(this) === -1) {
            seen.push(this);
            $(this).each(callback);
        }
    };

    $(options.target).find(selector).each(callbackOnce);

    var msobserver = new MutationSelectorObserver(selector, callbackOnce, options)
    this.push(msobserver);

    var observer = new MutationObserver(function (mutations) {
      var matches = [];

      for (var m = 0; m < mutations.length; m++) {
        if (mutations[m].type === 'attributes') {
          if (mutations[m].target.matches(msobserver.selector)) matches.push(mutations[m].target);

          if (msobserver.isFraternal) {
            matches.push.apply(matches, mutations[m].target.parentElement.querySelectorAll(msobserver.selector));
          } else {
            matches.push.apply(matches, mutations[m].target.querySelectorAll(msobserver.selector));
          }
        }

        if (mutations[m].type === 'childList') {
          for (var n = 0; n < mutations[m].addedNodes.length; n++) {
            if (!(mutations[m].addedNodes[n] instanceof Element)) continue;
            if (mutations[m].addedNodes[n].matches(msobserver.selector)) matches.push(mutations[m].addedNodes[n]);

            if (msobserver.isFraternal) {
              matches.push.apply(matches, mutations[m].addedNodes[n].parentElement.querySelectorAll(msobserver.selector));
            } else {
              matches.push.apply(matches, mutations[m].addedNodes[n].querySelectorAll(msobserver.selector));
            }
          }
        }
      }

      for (var i = 0; i < matches.length; i++) {
        $(matches[i]).each(msobserver.callback);
      }
    });

    var defaultObeserverOpts = {
      childList: true,
      subtree: true,
      attributes: msobserver.isComplex
    };

    observer.observe(options.target, options.observer || defaultObeserverOpts );

    return observer;
  };

  $.fn.initialize = function (callback, options) {
    return msobservers.initialize(this.selector, callback, $.extend({}, $.initialize.defaults, options));
  };

  $.initialize = function (selector, callback, options) {
    return msobservers.initialize(selector, callback, $.extend({}, $.initialize.defaults, options));
  };

  $.initialize.defaults = {
    target: document.documentElement,
    observer: null
  }
})(jQuery);
