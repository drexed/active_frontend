;(function ($, window, document) {
  var pluginName = 'xpull';
  var defaults = {
    paused: false,
    pullThreshold: 50,
    maxPullThreshold: 50,
    spinnerTimeout: 0,
    scrollingDom: null,
    onPullStartCallback: function () {},
    onPullEndCallback: function () {},
    onPullRefreshCallback: function () {
      window.location.reload();
    }
  };

  function Plugin (element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      var ofstop = 0;
      var fingerOffset = 0;
      var top = 0;
      var hasc = false;
      var elm = {};

      that.$element = $(that.element);
      that.elm = elm = that.$element.children(':not(.xpull)');
      that.indicator = that.$element.find('.xpull:eq(0)');
      that.indicator.css({ display: 'block' });
      that.spinner = that.indicator.find('.xpull-spinner:eq(0)');
      that.startBlock = that.indicator.find('.xpull-content:eq(0)');
      that.indicatorHeight = that.indicator.outerHeight();

      that.changeStyle(-that.indicatorHeight, true);
      that.$element.css({
        '-webkit-overflow-scrolling': 'touch',
        'overflow-scrolling': 'touch'
      });

      ofstop = that.$element.offset().top;

      that.elast = true;
      that.startBlock.css('visibility', 'hidden');
      that.indicatorHidden = true;

      elm.unbind('touchstart.' + pluginName);
      elm.on('touchstart.' + pluginName, function (ev) {
        if (that.options.paused) return false;

        that.options.onPullStartCallback.call(this);
        fingerOffset = ev.originalEvent.touches[0].pageY - ofstop;
      });

      elm.unbind('touchmove.' + pluginName);
      elm.on('touchmove.' + pluginName, function (ev) {
        if (that.options.paused) return false;

        if (elm.position().top < 0 ||
            (that.options.scrollingDom || that.$element).scrollTop() > 0 ||
            document.body.scrollTop > 0) return true;

        if (that.indicatorHidden) {
          that.startBlock.css('visibility', 'visible');
          that.indicatorHidden = false;
        }

        top = (ev.originalEvent.touches[0].pageY - ofstop - fingerOffset);

        if (top > 1) {
          if (that.elast) {
            $(document.body).on('touchmove.' + pluginName, function (e) {
              e.preventDefault();
            });

            that.elast = false;
          }

          if (top <= (parseInt(that.options.pullThreshold) + that.options.maxPullThreshold)) {
            that.changeStyle((top - that.indicatorHeight), false);
          }

          if (top > that.options.pullThreshold && !hasc) {
            that.indicator.addClass('xpull-pulled');
          } else if (top <= that.options.pullThreshold && hasc) {
            that.indicator.removeClass('xpull-pulled');
          }
        } else {
          $(document.body).unbind('touchmove.' + pluginName);
          that.elast = true;
        }

        hasc = that.indicator.hasClass('xpull-pulled');
      });

      elm.unbind('touchend.' + pluginName);
      elm.on('touchend.' + pluginName, function () {
        if (that.options.paused) return false;

        that.options.onPullEndCallback.call(this);

        if (top > 0) {
          if (top > that.options.pullThreshold) {
            that.startBlock.hide();
            that.spinner.show();

            setTimeout(function () {
              that.options.onPullRefreshCallback.call(this);
            }, 300);

            that.options.paused = true;

            that.changeStyle(0, true);

            if (that.options.spinnerTimeout) {
              setTimeout(function () {
                that.reset();
              }, that.options.spinnerTimeout);
            }
          } else {
            that.changeStyle(-that.indicatorHeight, true);
          }

          top = 0;
        }

        if (!that.indicatorHidden) {
          that.startBlock.css('visibility', 'hidden');
          that.indicatorHidden = true;
        }

        setTimeout(function() {
          elm.css({ 'transition': '' });
          that.indicator.css({ 'transition': '' });
          $(document.body).unbind('touchmove.' + pluginName);
          that.elast = true;
        }, 300);
      });
    },
    changeStyle: function (top, transition) {
      var topPx = top + 'px';
      var heightPx = top > 50 ? '50px' : topPx;

      var changeCss = {
        height: heightPx,
        transform: 'translate3d(0px, ' + heightPx + ', 0px)',
        transition: 'transform 0s ease-in-out'
      };

      if (!transition) {
        changeCss.transition = '';
      }

      this.indicator.css(changeCss);

      delete changeCss.height;
      this.elm.css(changeCss);
    },
    reset: function() {
      var that = this;

      that.changeStyle(-that.indicatorHeight, true);

      setTimeout(function() {
        that.startBlock.show();
        that.spinner.hide();
        that.options.paused = false;
        that.indicator.removeClass('xpull-pulled');

        that.changeStyle(-that.indicatorHeight, false);
        $(document.body).unbind('touchmove.' + pluginName);
        that.elast = true;
      }, 300);
    },
    destroy: function () {
      var that = this;
      var elm = that.elm;

      that.changeStyle(0);
      that.indicator.css({ display: 'none' });

      elm.off('touchstart.' + pluginName);
      elm.off('touchmove.' + pluginName);
      elm.off('touchend.' + pluginName);
      $(document.body).off('touchmove.' + pluginName);

      that.$element.removeData('plugin_' + pluginName);
    }
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      var pName = 'plugin_' + pluginName;

      if (!$.data(this, pName)) {
        $.data(this, pName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
