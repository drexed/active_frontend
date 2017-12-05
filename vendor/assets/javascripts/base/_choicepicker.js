+function ($) {
  'use strict';

  // CHOICEPICKER PUBLIC CLASS DEFINITION
  // ====================================

  var Choicepicker = function (element, options) {
    this.$element = $(element);
    this.settings = {
      choices: this.$element.data('choices') || Choicepicker.DEFAULTS.text.choices,
      fuzzySearch: this.$element.data('fuzzy-search') || Choicepicker.DEFAULTS.text.fuzzySearch,
      text: {
        all: this.$element.data('text-all') || Choicepicker.DEFAULTS.text.all,
        choiceless: this.$element.data('text-choiceless') || Choicepicker.DEFAULTS.text.choiceless,
        none: this.$element.data('text-none') || Choicepicker.DEFAULTS.text.none,
        placeholder: this.$element.data('text-placeholder') || Choicepicker.DEFAULTS.text.placeholder,
        selectAll: this.$element.data('text-select-all') || Choicepicker.DEFAULTS.text.selectAll
      },
      type: this.$element.data('type') || Choicepicker.DEFAULTS.text.type
    };
    this.options = $.extend({}, Choicepicker.DEFAULTS, this.settings, options);

    this.$checkAll = false;
    this.$selector = 'bsChoicepicker-label-' + this.randomNumber() + '-';
    this.$fuzzyId = 'bsChoicepicker-fuzzy-' + this.randomNumber();
    this.$widget = $(this.initWidget()).on('click', $.proxy(this.clickWidget, this));

    this.init();
  };

  if (!$.fn.dropdown) throw new Error('Choicepicker requires dropdown.js');
  if (!$.fn.list) throw new Error('Choicepicker requires list.js');

  Choicepicker.VERSION = '1.0.0';
  Choicepicker.DEFAULTS = {
    choices: [],
    choiceClass: 'form-align-vertical dark',
    filterClass: 'dark',
    fuzzySearch: true,
    item: '<li></li>',
    menu: '<ul class="choicepicker dropmenu caret"><span></span></ul>',
    onCheckAllCallback: function (value) {},
    onSetValCallback: function (choice) {},
    text: {
      all: 'All',
      choiceless: 'No choices available',
      none: 'None',
      placeholder: 'Filter options...',
      selectAll: 'Select all'
    },
    type: 'checkbox'
  };

  Choicepicker.prototype.constructor = Choicepicker;

  Choicepicker.prototype.init = function () {
    if (!this.hasChoices()) return;

    this.elementReadOnly();
    this.setWidget();
    this.setVal();
    this.clickCheckAll();

    this.$element.on({
      'focus.bs.choicepicker': $.proxy(this.showWidget, this),
      'click.bs.choicepicker': $.proxy(this.showWidget, this),
      'blur.bs.choicepicker': $.proxy(this.setVal, this)
    });
  };

  Choicepicker.prototype.clickWidget = function (e) {
    e.stopPropagation();

    if (!this.hasChoices()) return;

    this.setVal();
  };

  Choicepicker.prototype.initWidget = function () {
    var _self = this;
    var menu = $(this.options.menu);

    if (this.options.fuzzySearch && this.hasFuzzyAmount()) {
      menu.attr('data-toggle', 'list')
        .attr('data-input', '#' + this.$fuzzyId)
        .find('span')
        .append(this.fuzzyTemplate());
    }

    if (this.options.type === 'checkbox') {
      menu.find('span')
        .append(this.allTemplate());
    }

    $.each(this.options.choices, function (index, hash) {
      var item = $(_self.options.item);

      item.append(_self.optionTemplate(hash))
        .append(_self.labelTemplate(hash).text(hash.label));

      menu.find('span')
        .append(item);
    });

    return menu;
  };

  Choicepicker.prototype.setWidget = function () {
    this.$container = $('<span>')
      .addClass('btn-group dropdown bsChoicepicker')
      .css({
        height: 0,
        position: 'absolute',
        width: 0
      });

    try {
      this.$container.append(this.$widget);
      this.$element.after(this.$container);
    } catch(e) {
      // Do nothing
    }
  };

  Choicepicker.prototype.showWidget = function () {
    this.$container.addClass('open');

    var _self = this;
    $(document).on('mousedown.bs.choicepicker, touchend.bs.choicepicker', function (e) {
      if (!(_self.$element.parent().find(e.target).length ||
          _self.$widget.is(e.target) ||
          _self.$widget.find(e.target).length)) {
        _self.hideWidget();
      }
    });
  };

  Choicepicker.prototype.hideWidget = function () {
    this.$container.removeClass('open');
  };

  Choicepicker.prototype.type = function () {
    var type = this.options.type;

    if (type !== 'checkbox' && type !== 'radio') {
      type = 'checkbox';
    }

    return type;
  };

  Choicepicker.prototype.elementReadOnly = function () {
    this.$element.prop('readonly', true);
  };

  Choicepicker.prototype.selector = function (hash) {
    var selector = this.$selector + hash.selector;

    return selector;
  };

  Choicepicker.prototype.checkAllSelector = function () {
    var selector = this.$selector + 'checkall';

    return selector;
  };

  Choicepicker.prototype.clickCheckAll = function () {
    var _self = this;
    var checkAll = $('#' + this.checkAllSelector());

    checkAll.on('change', function () {
      $.each(_self.options.choices, function (index, hash) {
        var selector = $('#' + _self.selector(hash));

        if (selector) selector.prop('checked', checkAll.is(':checked'));
      });

      $.event.trigger({
        type: 'bs.choicepicker.on-check-all',
        value: checkAll.val()
      });
      _self.options.onCheckAllCallback(checkAll.val());
    });
  };

  Choicepicker.prototype.setCheckAll = function (checked) {
    var checkbox = $('#' + this.checkAllSelector());

    this.$checkAll = checked;
    checkbox.prop('checked', checked);
  };

  Choicepicker.prototype.labelTemplate = function (hash) {
    var selector = this.selector(hash);

    return $('<label for="' + selector + '">');
  };

  Choicepicker.prototype.hasFuzzyAmount = function () {
    if (this.options.type === 'radio') {
      return this.options.choices.length > 4;
    } else {
      return this.options.choices.length > 3;
    }
  };

  Choicepicker.prototype.fuzzyTemplate = function () {
    var container = $('<div class="form-input form-size-s">');
    var textbox = $('<input type="text" class="' + this.options.filterClass + '" placeholder="' + this.options.text.placeholder + '" id="' + this.$fuzzyId + '" autofocus>');

    container.append(textbox);

    var item = $(this.options.item);
    item.addClass('choicepicker-fuzzy list-skip-filter')
      .append(container);

    return item;
  };

  Choicepicker.prototype.allTemplate = function () {
    var selector = this.checkAllSelector();
    var boxLabel = $('<label for="' + selector + '">');
    var textLabel = boxLabel.clone();

    boxLabel.append('<i class="icon-check"></i>');

    var checkbox = $('<input type="checkbox" id="' + selector + '">');
    checkbox.prop('checked', this.$checkAll);

    var container = $('<div class="form-checkbox ' + this.options.choiceClass + '">');
    container.append(checkbox);
    container.append(boxLabel);

    var item = $(this.options.item);
    item.addClass('list-skip-filter')
      .append(container)
      .append(textLabel.text(this.options.text.selectAll));

    return item;
  };

  Choicepicker.prototype.optionTemplate = function (hash) {
    var type = this.type();
    var selector = this.selector(hash);

    var label = this.labelTemplate(hash);
    label.append('<i class="icon-check"></i>');

    var checkbox = $('<input type="' + type +'" value="' + hash.value + '" name="' + hash.name + '" id="' + selector + '">');
    checkbox.prop('checked', hash.checked);

    var container = $('<div class="form-' + type + ' ' + this.options.choiceClass + '">');
    container.append(checkbox);
    container.append(label);

    return container;
  };

  Choicepicker.prototype.setVal = function () {
    var label = this.setSelectionsLabel();

    if (label == '[object Object]') return;

    this.$element.val(label);
    $.event.trigger({
      type: 'bs.choicepicker.on-set-val',
      choice: label
    });
    this.options.onSetValCallback(label);
  };

  Choicepicker.prototype.randomNumber = function () {
    return Math.floor((Math.random() * 100000) + 1);
  };

  Choicepicker.prototype.selectionLabel = function (label, count) {
    count = count - 1;

    if (count === 0) return label;

    return label + ' (+' + count + ')';
  };

  Choicepicker.prototype.choiceCount = function () {
    return Object.keys(this.options.choices).length;
  };

  Choicepicker.prototype.hasChoices = function () {
    return this.choiceCount() !== 0;
  };

  Choicepicker.prototype.setSelectionsLabel = function () {
    var _self = this;
    var total = this.choiceCount();
    var count = 0;
    var label = '';

    if (total === 0) return this.options.text.choiceless;

    $.each(this.options.choices, function (index, hash) {
      if (hash.checked === undefined) {
        hash.checked = false;
      } else {
        var selector = $('#' + _self.selector(hash));

        if (selector) {
          hash.checked = selector.prop('checked');
        }
      }

      if (hash.checked) {
        count++;

        if (label === '') {
          label = hash.label;
        }
      }
    });

    if (count === total) {
      this.setCheckAll(true);
      return this.options.text.all;
    }

    if (count === 0) {
      this.setCheckAll(false);
      return this.options.text.none;
    }

    this.setCheckAll(false);
    return this.selectionLabel(label, count);
  };

  // CHOICEPICKER PLUGIN DEFINITION
  // ==============================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.choicepicker');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.choicepicker', (data = new Choicepicker(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.choicepicker;

  $.fn.choicepicker = Plugin;
  $.fn.choicepicker.Constructor = Choicepicker;

  // CHOICEPICKER NO CONFLICT
  // ========================

  $.fn.choicepicker.noConflict = function () {
    $.fn.choicepicker = old;
    return this;
  };

  // CHOICEPICKER DATA-API
  // =====================

  $(document)
    .on('ready.bs.choicepicker.data-api', function () {
      $('[data-toggle="choicepicker"]').each(function () {
        var $this = $(this);
        if ($this.data('choicepicker')) return;
        Plugin.call($this, $this.data());
      });
    }).on('focus.bs.choicepicker.data-api click.bs.choicepicker.data-api', '[data-toggle="choicepicker"]', function (e) {
      var $this = $(this);
      if ($this.data('choicepicker')) return;
      Plugin.call($this, $this.data());
    });

}(jQuery);
