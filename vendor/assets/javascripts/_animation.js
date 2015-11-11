+function ($) {
  'use strict';

  // ANIMATION CLASS DEFINITION
  // ==========================

  var Animation = function (element, options) {
    this.options  = $.extend({}, options)
    this.$element = $(element)
  };

  Animation.VERSION  = '3.3.2'

  Animation.TRANSITION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'

  $.fn.extend({
    animation: function(effect, options) {
      var addClass, animation, callback, complete, init, removeClass, setDelay, setDuration, settings, unhide;

      settings = {
        effect:   effect,
        delay:    '0s',
        klass:    'animation animation-',
        infinite: false,
        callback: options,
        duration: '1s',
        debug:    false
      };

      settings = $.extend(settings, options);
      init = function(element) {
        return animation(element);
      };

      animation = function(element) {
        if (settings.infinite === true) {
          settings.klass += ' infinite';
        }

        setDelay(element);
        setDuration(element);
        unhide(element);
        addClass(element);
        return complete(element);
      };

      addClass = function(element) {
        return element.addClass(settings.klass + settings.effect);
      };

      unhide = function(element) {
        if (element.css('visibility') === 'hidden') {
          element.css('visibility', 'visible');
        }
        if (element.is(':hidden')) {
          return element.show();
        }
      };

      removeClass = function(element) {
        return element.removeClass(settings.klass + settings.effect);
      };

      setDelay = function(element) {
        return element.css({
          '-webkit-animation-delay': settings.delay,
          '-moz-animation-delay':    settings.delay,
          '-o-animation-delay':      settings.delay,
          'animation-delay':         settings.delay
        });
      };

      setDuration = function(element) {
        return element.css({
          '-webkit-animation-duration': settings.duration,
          '-moz-animation-duration':    settings.duration,
          '-o-animation-duration':      settings.duration,
          'animation-duration':         settings.duration
        });
      };

      callback = function(element) {
        if (settings.infinite === false) {
          removeClass(element);
        }
        if (typeof settings.callback === 'function') {
          return settings.callback.call(element);
        }
      };

      complete = function(element) {
        return element.one(Animation.TRANSITION_END, function() {
          return callback(element);
        });
      };

      return this.each(function() {
        return init($(this));
      });
    }
  });

}(jQuery);