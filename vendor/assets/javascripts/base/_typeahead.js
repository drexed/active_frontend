+function ($) {
  'use strict';

  // TYPEAHEAD PUBLIC CLASS DEFINITION
  // =================================

  var Typeahead = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Typeahead.DEFAULTS, options);

    this.$menu = $(this.options.menu);
    this.shown = false;

    this.init();
  };

  Typeahead.VERSION = '1.0.0';
  Typeahead.DEFAULTS = {
    autoSelect: true,
    item: '<li><a href="#"></a></li>',
    items: 5,
    menu: '<ul class="typeahead dropmenu caret"></ul>',
    minLength: 1,
    scrollHeight: 0,
    source: []
  };

  Typeahead.prototype.constructor = Typeahead;

  Typeahead.prototype.select = function () {
    var val = this.$menu.find('.active').data('value');

    if(this.options.autoSelect || val) {
      this.$element
        .val(this.updater(val))
        .change();
    }

    return this.hide();
  };

  Typeahead.prototype.updater = function (item) {
    return item;
  };

  Typeahead.prototype.setSource = function (source) {
    this.options.source = source;
  };

  Typeahead.prototype.show = function () {
    var scrollHeight;
    var pos = $.extend({}, this.$element.position(), {
      height: this.$element[0].offsetHeight
    });

    scrollHeight = typeof this.options.scrollHeight === 'function' ?
      this.options.scrollHeight.call() :
      this.options.scrollHeight;

    this.$menu
      .insertAfter(this.$element)
      .css({
        top: pos.top + pos.height + scrollHeight,
        left: pos.left
      })
      .show();

    this.shown = true;
    return this;
  };

  Typeahead.prototype.hide = function () {
    this.$menu.hide();
    this.shown = false;
    return this;
  };

  Typeahead.prototype.lookup = function (query) {
    var items;

    if (typeof(query) !== 'undefined' && query !== null) {
      this.query = query;
    } else {
      this.query = this.$element.val() || '';
    }

    if (this.query.length < this.options.minLength) {
      return this.shown ? this.hide() : this;
    }

    items = $.isFunction(this.options.source) ?
      this.options.source(this.query, $.proxy(this.process, this)) :
      this.options.source;

    return items ? this.process(items) : this;
  };

  Typeahead.prototype.process = function (items) {
    var that = this;

    items = $.grep(items, function (item) {
      return that.matcher(item);
    });

    items = this.sorter(items);

    if (!items.length) {
      return this.shown ? this.hide() : this;
    }

    if (this.options.items === 'all' || this.options.minLength === 0 && !this.$element.val()) {
      return this.render(items).show();
    } else {
      return this.render(items.slice(0, this.options.items)).show();
    }
  };

  Typeahead.prototype.matcher = function (item) {
    return ~item.toLowerCase().indexOf(this.query.toLowerCase());
  };

  Typeahead.prototype.sorter = function (items) {
    var beginswith = [];
    var caseSensitive = [];
    var caseInsensitive = [];
    var item;

    while ((item = items.shift())) {
      if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {
        beginswith.push(item);
      } else if (~item.indexOf(this.query)) {
        caseSensitive.push(item);
      } else {
        caseInsensitive.push(item);
      }
    }

    return beginswith.concat(caseSensitive, caseInsensitive);
  };

  Typeahead.prototype.highlighter = function (item) {
    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');

    return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
      return '<b>' + match + '</b>';
    });
  };

  Typeahead.prototype.render = function (items) {
    var that = this;

    items = $(items).map(function (i, item) {
      i = $(that.options.item).data('value', item);
      i.find('a').html(that.highlighter(item));
      return i[0];
    });

    if (this.options.autoSelect) {
      items.first()
        .addClass('active');
    }

    this.$menu.html(items);
    return this;
  };

  Typeahead.prototype.next = function (event) {
    var active = this.$menu.find('.active').removeClass('active');
    var next = active.next();

    if (!next.length) {
      next = $(this.$menu.find('li')[0]);
    }

    next.addClass('active');
  };

  Typeahead.prototype.prev = function (event) {
    var active = this.$menu.find('.active').removeClass('active');
    var prev = active.prev();

    if (!prev.length) {
      prev = this.$menu.find('li').last();
    }

    prev.addClass('active');
  };

  Typeahead.prototype.init = function () {
    this.$element
      .on('focus', $.proxy(this.focus, this))
      .on('blur', $.proxy(this.blur, this))
      .on('keypress', $.proxy(this.keypress, this))
      .on('keyup', $.proxy(this.keyup, this));

    if (this.eventSupported('keydown')) {
      this.$element.on('keydown', $.proxy(this.keydown, this));
    }

    this.$menu
      .on('click', $.proxy(this.click, this))
      .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
      .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
  };

  Typeahead.prototype.destroy = function () {
    this.$element.data('typeahead',null);
    this.$element
      .off('focus')
      .off('blur')
      .off('keypress')
      .off('keyup');

    if (this.eventSupported('keydown')) this.$element.off('keydown');
    this.$menu.remove();
  };

  Typeahead.prototype.eventSupported = function (eventName) {
    var isSupported = eventName in this.$element;

    if (!isSupported) {
      this.$element.setAttribute(eventName, 'return;');
      isSupported = typeof this.$element[eventName] === 'function';
    }

    return isSupported;
  };

  Typeahead.prototype.move = function (e) {
    if (!this.shown) return;

    switch(e.keyCode) {
      case 9:
      case 13:
      case 27:
        e.preventDefault();
        break;

      case 38:
        e.preventDefault();
        this.prev();
        break;

      case 40:
        e.preventDefault();
        this.next();
        break;
    }

    e.stopPropagation();
  };

  Typeahead.prototype.keydown = function (e) {
    this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);

    if (!this.shown && e.keyCode === 40) {
      this.lookup('');
    } else {
      this.move(e);
    }
  };

  Typeahead.prototype.keypress = function (e) {
    if (this.suppressKeyPressRepeat) return;
    this.move(e);
  };

  Typeahead.prototype.keyup = function (e) {
    switch(e.keyCode) {
      case 40:
      case 38:
      case 16:
      case 17:
      case 18:
        break;

      case 9:
      case 13:
        if (!this.shown) return;
        this.select();
        break;

      case 27:
        if (!this.shown) return;
        this.hide();
        break;

      default:
        this.lookup();
    }

    e.stopPropagation();
    e.preventDefault();
  };

  Typeahead.prototype.focus = function (e) {
    if (!this.focused) {
      this.focused = true;
      if (this.options.minLength === 0 && !this.$element.val()) this.lookup();
    }
  };

  Typeahead.prototype.blur = function (e) {
    this.focused = false;
    if (!this.mousedover && this.shown) this.hide();
  };

  Typeahead.prototype.click = function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.select();
    this.$element.focus();
  };

  Typeahead.prototype.mouseenter = function (e) {
    this.mousedover = true;
    this.$menu.find('.active').removeClass('active');
    $(e.currentTarget).addClass('active');
  };

  Typeahead.prototype.mouseleave = function (e) {
    this.mousedover = false;
    if (!this.focused && this.shown) this.hide();
  };

  // TYPEAHEAD PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.typeahead');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.typeahead', (data = new Typeahead(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.typeahead;

  $.fn.typeahead = Plugin;
  $.fn.typeahead.Constructor = Typeahead;

  // TYPEAHEAD NO CONFLICT
  // =====================

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };

  // TYPEAHEAD DATA-API
  // ==================

  $(document).on('focus.bs.typeahead.data-api click.bs.typeahead.data-api', '[data-toggle="typeahead"]', function (e) {
    var $this = $(this);
    if ($this.data('typeahead')) return;
    Plugin.call($this, $this.data());
  });

}(jQuery);
