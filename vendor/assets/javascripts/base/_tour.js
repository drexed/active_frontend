+function ($) {
  'use strict';

  // TOUR CLASS DEFINITION
  // =====================

  var Tour = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Tour.DEFAULTS, options);

    this.$active = false;
    this.$interval = null;
    this.$timeout = null;
    this.$totalItems = this.options.items.length;

    this.initCurrentItem();
    this.init();
  };

  if (!$.fn.popover) throw new Error('Tour requires popover.js');

  Tour.VERSION = '1.0.0';
  Tour.OFFSET = 200;
  Tour.DEFAULTS = {
    buttonClass: 'btn btn-size-s',
    delay: 3000,
    items: [],
    manual: true,
    onMissCallback: function (item) {},
    onShowCallback: function (item) {},
    onShownCallback: function (item) {},
    parent: 'html, body',
    skip: true,
    storage: false,
    storageKey: 'storage.bs.tour',
    text: {
      end: 'End',
      endTour: 'End Tour',
      next: 'Next',
      prev: 'Prev',
      stop: 'Stop'
    }
  };

  Tour.prototype.constructor = Tour;

  Tour.prototype.init = function () {
    var _self = this;

    this.$element.on('click', function () {
      if (_self.$totalItems === 0) return this;

      if (_self.$active) {
        _self.endTour();
      } else {
        _self.startTour();

        if (!_self.options.manual) _self.cycleItems();
      }
    });

    $('body')
      .on('click', '[data-tour="next"]', function () {
        _self.nextItem();
      })
      .on('click', '[data-tour="prev"]', function () {
        _self.prevItem();
      })
      .on('click', '[data-tour="stop"]', function () {
        _self.stopCycling();
        $(this).remove();
      })
      .on('click', '[data-tour="end"]', function () {
        _self.endTour();
      });
  };

  Tour.prototype.startTour = function () {
    this.nextItem();
    this.$startText = this.$element.text();
    this.$element.text(this.options.text.endTour);
    this.$active = true;
  };

  Tour.prototype.nextItem = function () {
    this.incr();
    this.displayItem(this.getItem());
  };

  Tour.prototype.prevItem = function () {
    this.decr();
    this.displayItem(this.getItem());
  };

  Tour.prototype.endTour = function () {
    this.stopCycling();
    this.removeItems();
    this.$currentItem = 0;
    this.$active = false;
    this.setCurrentItem();
    this.$element.text(this.$startText);
    this.$element.scrollToItem(this.options.parent, 'top');
  };

  Tour.prototype.incr = function () {
    if (this.$currentItem < this.$totalItems) this.$currentItem++;
    this.setCurrentItem();
  };

  Tour.prototype.decr = function () {
    if (this.$currentItem > 1) this.$currentItem--;
    this.setCurrentItem();
  };

  Tour.prototype.popoverTemplate = function () {
    var stopBtn = '<button class="' + this.options.buttonClass + '" data-tour="stop">' + this.options.text.stop + '</button>';
    var prevBtn = '<button class="' + this.options.buttonClass + '" data-tour="prev">' + this.options.text.prev + '</button>';
    var nextBtn = '<button class="' + this.options.buttonClass + '" data-tour="next">' + this.options.text.next + '</button>';
    var endBtn = '<button class="' + this.options.buttonClass + ' pull-right" data-tour="end">' + this.options.text.end + '</button>';
    var btnGroup = $('<div class="btn-group pull-left">');
    var navigation = $('<div class="popover-nav row">');
    var popover = $('<div class="popover" role="tooltip">')
      .append('<div class="arrow"></div>')
      .append('<strong class="popover-title"></strong>')
      .append('<div class="popover-content"></div>');

    if (this.options.manual) {
      if (this.$currentItem > 1) btnGroup.append(prevBtn);
      if (this.$currentItem < this.$totalItems) btnGroup.append(nextBtn);
    } else {
      btnGroup.append(stopBtn);
    }

    navigation.append(btnGroup);
    navigation.append(endBtn);
    popover.append(navigation);

    return popover;
  };

  Tour.prototype.displayItem = function (item) {
    var element = $(item.id);

    this.removeItems();

    $.event.trigger({
      type: 'show.bs.tour',
      item: item
    });
    this.options.onShowCallback(item);

    if (element.length !== 0 && element.is(':visible')) {
      $(item.id + ':first').popover({
        container: item.container || false,
        content: item.content,
        html: true,
        placement: item.placement || 'top',
        title: item.title,
        template: this.popoverTemplate(),
        trigger: 'manual'
      });

      element.scrollToItem(item.parent || this.options.parent, item.placement);

      setTimeout(function () {
        element.popover('show');
      }, 225);

      $.event.trigger({
        type: 'shown.bs.tour',
        item: item
      });
      this.options.onShownCallback(item);
    } else {
      if (this.options.skip) this.nextItem();
      $.event.trigger({
        type: 'miss.bs.tour',
        item: item
      });
      this.options.onMissCallback(item);
    }
  };

  Tour.prototype.getItem = function () {
    return this.options.items[this.$currentItem - 1];
  };

  Tour.prototype.initCurrentItem = function () {
    if (this.options.storage) {
      this.$currentItem = this.storageGetStep();
    } else {
      this.$currentItem = 0;
    }
  };

  Tour.prototype.setCurrentItem = function () {
    if (this.options.storage) this.storageSetStep();
  };

  Tour.prototype.cycleItems = function () {
    var _self = this;

    this.$interval = setInterval(function () {
      _self.nextItem();

      if (_self.$currentItem === _self.$totalItems) {
        _self.$timeout = setTimeout(function () {
          _self.endTour();
        }, _self.options.delay);

        clearInterval(_self.$interval);
      }
    }, this.options.delay);
  };

  Tour.prototype.removeItems = function () {
    $('.popover').remove();
  };

  Tour.prototype.stopCycling = function () {
    clearInterval(this.$interval);
    clearTimeout(this.$timeout);
  };

  Tour.prototype.storageNotAccessible = function () {
    return typeof(Storage) === 'undefined';
  };

  Tour.prototype.storageGetStep = function () {
    if (this.storageNotAccessible()) return;
    return localStorage.getItem(this.options.storageKey);
  };

  Tour.prototype.storageSetStep = function () {
    if (this.storageNotAccessible()) return;
    localStorage.setItem(this.options.storageKey, this.$currentItem);
  };

  $.fn.scrollToItem = function (parent, placement) {
    var offset = Tour.OFFSET;

    if (placement === 'bottom') {
      offset = -offset;
    }

    $(parent).animate({
      scrollTop: $(this).position().top - offset + 'px'
    }, 200);

    return this;
  };

  // TOUR PLUGIN DEFINITION
  // ======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tour');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.tour', (data = new Tour(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.tour;

  $.fn.tour = Plugin;
  $.fn.tour.Constructor = Tour;

  // TOUR NO CONFLICT
  // ================

  $.fn.tour.noConflict = function () {
    $.fn.tour = old;
    return this;
  };

}(jQuery);
