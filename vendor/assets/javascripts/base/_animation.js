+function ($) {
  'use strict';

  // ANIMATION PUBLIC CLASS DEFINITION
  // =================================

  var Animation = function (element, options) {
    this.$element = $(element);

    this.settings = {
      delay: this.$element.data('delay'),
      duration: this.$element.data('duration'),
      effect: this.$element.data('effect'),
      hide: this.$element.data('hide'),
      infinite: this.$element.data('infinite')
    };
    this.options = $.extend({}, Animation.DEFAULTS, this.settings, options);

    this.init(this.$element);
  };

  Animation.VERSION = '1.0.0';
  Animation.TRANSITION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  Animation.DEFAULTS = {
    delay: 'n',
    duration: 'b',
    effect: 'bounce',
    hide: false,
    infinite: false
  };

  Animation.prototype.constructor = Animation;

  Animation.prototype.init = function () {
    var element = this.reset();
    var hide = this.options.hide;
    var infinite = this.options.infinite;
    var animation = 'animation' +
      ' animation-effect-' + this.options.effect +
      ' animation-delay-' + this.options.delay +
      ' animation-duration-' + this.options.duration +
      (infinite === true ? ' infinite' : '');

    if (element.hasClass('hidden') || element.is(':hidden')) {
      element.removeClass('hidden');
      element.show();
    }
    if (element.css('visibility') === 'hidden') element.css('visibility', 'visible');

    element.removeClass(animation)
      .addClass(animation)
      .on(Animation.TRANSITION_END, function (event) {
        event.stopPropagation();
        event.preventDefault();

        if (infinite !== true) element.removeClass(animation);
        if (hide === true) element.addClass('hidden');
      });
  };

  Animation.prototype.reset = function () {
    this.$element.before(this.$element.clone(true));

    var clone = this.$element.prev();
    this.$element.remove();

    return clone;
  };

  // ANIMATION PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.animation');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.animation', (data = new Animation(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.animation;

  $.fn.animation = Plugin;
  $.fn.animation.Constructor = Animation;

  // ANIMATION NO CONFLICT
  // =====================

  $.fn.animation.noConflict = function () {
    $.fn.animation = old;
    return this;
  };

  // ANIMATION DATA-API
  // ==================

  $(document).on('[data-toggle="animation"]', function (e) {
    var $this = $(this);
    if ($this.data('animation')) return;
    Plugin.call($this, $this.data());
  });

}(jQuery);
