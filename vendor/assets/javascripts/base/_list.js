+function ($) {
  'use strict';

  // LIST CLASS DEFINITION
  // =====================

  var List = function (element, options) {
    this.$element = $(element);
    this.settings = {
      emptyText: this.$element.data('empty-text') || List.DEFAULTS.emptyText,
      input: this.$element.data('input') || List.DEFAULTS.input
    };
    this.options = $.extend({}, List.DEFAULTS, this.settings, options);

    this.$input = $(this.options.input);
    this.$lis = this.listLis();
    this.$len = this.$lis.length;

    this.init();
  };

  List.VERSION = '1.0.0';
  List.DEFAULTS = {
    emptyText: 'No matches found',
    input: null,
    onPlaceholderCallback: function () {},
    onVisibleItemsCallback: function (count) {}
  };

  List.prototype.constructor = List;

  List.prototype.init = function () {
    if (this.options.input === null) return this;

    var _self = this;
    var list = this.$element;
    var element = this.$input;

    element.keyup(function () {
      var filter = element.val().toLowerCase();
      var visible = 0;

      for (var i = 0; i < _self.$len; i++) {
        var li = $(_self.$lis[i]);
        if (li.hasClass('list-skip-filter')) { continue; }

        if (li.text().toLowerCase().indexOf(filter) >= 0) {
          li.removeClass('hidden');
          visible++;
        } else {
          li.addClass('hidden');
        }
      }

      if (_self.options.placeholder !== null) {
        var emptyLi = '<li class="bsListEmpty">' + _self.options.emptyText + '</li>';
        list.find('.bsListEmpty').remove();

        if (visible === 0) {
          if (_self.hasSpan()) {
            list.find('span').append(emptyLi);
          } else {
            list.append(emptyLi);
          }

          _self.options.onPlaceholderCallback();
        }
      }

      _self.options.onVisibleItemsCallback(visible);

      return false;
    });
  };

  List.prototype.hasSpan = function () {
    return this.$element.children().first().is('span');
  };

  List.prototype.listLis = function () {
    var kids = this.$element.children();

    if (this.hasSpan()) {
      kids = kids.children();
    }

    return kids;
  };

  // LIST PLUGIN DEFINITION
  // ======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.list');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.list', (data = new List(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.list;

  $.fn.list = Plugin;
  $.fn.list.Constructor = List;

  // LIST NO CONFLICT
  // ================

  $.fn.list.noConflict = function () {
    $.fn.list = old;
    return this;
  };

  // LIST DATA-API
  // =============

  $(document)
    .on('ready.bs.list.data-api', function () {
      $('[data-toggle="list"]').each(function () {
        var $this = $(this);
        if ($this.data('list')) return;
        Plugin.call($this, $this.data());
      });
    }).on('DOMCharacterDataModified.bs.list.data-api DOMSubtreeModified.bs.list.data-api DOMNodeInserted.bs.list.data-api', function () {
      $('[data-toggle="list"]').each(function () {
        var $this = $(this);
        if ($this.data('list')) return;
        Plugin.call($this, $this.data());
      });
    });

}(jQuery);
