(function ($, window, document, undefined) {
  'use strict';

  $.fn.animateCSS = function (effect, delay, callback) {
    return this.each(function () {

      var $this       = $(this),
        animated      = "animated",
        hidden        = "hidden",
        transitionEnd = "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        visibility    = "visibility",
        visible       = "visible";

      function run() {
        $this.addClass( animated + " " + effect)

        if ($this.css( visibility ) === hidden) {
          $this.css( visibility, visible)
        }

        if ($this.is(":" + hidden)) {
          $this.show()
        }

        $this.bind( transitionEnd, function () {
          $this.removeClass(animated + " " + effect)

          if (typeof callback === "function") {
            callback.call(this)
            $this.unbind( transitionEnd )
          }
        })
      }

      if (!delay || typeof delay === "function") {
        callback = delay;
        run()
      } else {
        setTimeout(run, delay)
      }

    })
  }

})(jQuery, window, document);