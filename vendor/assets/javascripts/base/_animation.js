+function ($) {
  'use strict';

  // ANIMATION PUBLIC CLASS DEFINITION
  // =================================

  var Animation = function (element, options) {
    this.$element = $(element);

    this.settings = {
      delay: this.$element.data('delay') || Animation.DEFAULTS.delay,
      duration: this.$element.data('duration') || Animation.DEFAULTS.duration,
      effect: this.$element.data('effect') || Animation.DEFAULTS.effect,
      hide: this.$element.data('hide') || Animation.DEFAULTS.hide,
      infinite: this.$element.data('infinite') || Animation.DEFAULTS.infinite
    };
    this.options = $.extend({}, Animation.DEFAULTS, this.settings, options);

    this.trigger();
  };

  Animation.VERSION = '1.0.0';
  Animation.TRANSITION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  Animation.DEFAULTS = {
    delay: 'n',
    duration: 'b',
    effect: 'bounce',
    hide: false,
    infinite: false,
    onTransitionEndCallback: function () {}
  };

  Animation.prototype.constructor = Animation;

  Animation.prototype.trigger = function () {
    var _self = this;
    var element = this.reset();
    var animation = this.animationClass();

    if (element.hasClass('hidden') || element.is(':hidden')) {
      element.removeClass('hidden');
      element.show();
    }
    if (element.css('visibility') === 'hidden') element.css('visibility', 'visible');

    element.removeClass(animation)
      .addClass(animation)
      .on(Animation.TRANSITION_END, function (e) {
        e.stopPropagation();
        e.preventDefault();

        if (!_self.options.infinite) element.removeClass(animation);
        if (_self.options.hide) element.addClass('hidden');

        _self.options.onTransitionEndCallback();
      });
  };

  Animation.prototype.animationClass = function () {
    return 'animation' +
      ' animation-effect-' + this.options.effect +
      ' animation-delay-' + this.options.delay +
      ' animation-duration-' + this.options.duration +
      (this.options.infinite ? ' infinite' : '');
  };

  Animation.prototype.reset = function () {
    this.$element.before(this.$element.clone());

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
