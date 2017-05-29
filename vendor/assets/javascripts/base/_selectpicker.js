+function ($) {
  'use strict';

  // SELECTPICKER PUBLIC CLASS DEFINITION
  // ====================================

  var Selectpicker = function (element, options) {
    this.$element = $(element);
    this.settings = {
      fuzzySearch: this.$element.data('fuzzy-search'),
      includePrompt: this.$element.data('include-prompt'),
      optionHoverClass: this.$element.data('option-hover-class'),
      optionSelectedClass: this.$element.data('option-selected-class'),
      text: {
        selectless: this.$element.data('text-selectless') || Selectpicker.DEFAULTS.text.selectless,
        placeholder: this.$element.data('text-placeholder') || Selectpicker.DEFAULTS.text.placeholder,
        prompt: this.$element.data('text-prompt') || Selectpicker.DEFAULTS.text.prompt
      }
    };
    this.options = $.extend({}, Selectpicker.DEFAULTS, this.settings, options);

    this.$optgroups = this.getOptgroups();
    this.$options = this.getOptions();
    this.$selected = this.getSelectedOptionVal();
    this.$fuzzyId = 'bsSelectpicker-fuzzy-' + this.randomNumber();
    this.$widget = $(this.initWidget()).on('click', $.proxy(this.clickWidget, this));

    this.init();
  };

  if (!$.fn.dropdown) throw new Error('Selectpicker requires dropdown.js');
  if (!$.fn.list) throw new Error('Selectpicker requires list.js');

  Selectpicker.VERSION = '1.0.0';
  Selectpicker.DEFAULTS = {
    fuzzySearch: true,
    includePrompt: true,
    item: '<li></li>',
    menu: '<ul class="selectpicker dropmenu caret"><span></span></ul>',
    onChangeCallback: function (old_value, new_value) {},
    onSetValCallback: function (value) {},
    optionHoverClass: 'text-color-hover-blue',
    optionSelectedClass: 'text-color-blue',
    text: {
      selectless: 'No options available',
      placeholder: 'Filter options...',
      prompt: 'None'
    }
  };

  Selectpicker.prototype.constructor = Selectpicker;

  Selectpicker.prototype.init = function () {
    if (!this.hasSelects()) return;

    this.setWidget();

    this.$element.on('mousedown', function(e) {
         e.preventDefault();
         this.blur();
         this.focus();
      }).on({
        'focus.bs.selectpicker': $.proxy(this.showWidget, this),
        'click.bs.selectpicker': $.proxy(this.showWidget, this),
        'blur.bs.selectpicker': $.proxy(this.setVal, this)
      });
  };

  Selectpicker.prototype.clickWidget = function (e) {
    e.stopPropagation();
    e.preventDefault();

    var value = $(e.target).data('val');

    if (value === undefined) return;

    this.setVal(value);
    this.hideWidget();
  };

  Selectpicker.prototype.initWidget = function () {
    var _self = this;
    var menu = $(this.options.menu);
    var optgroups = this.parseOptgroupsToHash();

    if (this.options.fuzzySearch && this.hasFuzzyAmount()) {
      menu.attr('data-toggle', 'list')
        .attr('data-input', '#' + this.$fuzzyId)
        .find('span')
        .append(this.fuzzyTemplate());
    }

    $.each(this.parseOptionsToHash(), function (index, hash) {
      var optgroup = optgroups[hash.value];

      if (optgroup !== undefined) {
        menu.find('span').append(_self.optgroupTemplate(optgroup));
      }

      var item = $(_self.options.item);

      item.append(_self.optionTemplate(hash));

      menu.find('span')
        .append(item);
    });

    return menu;
  };

  Selectpicker.prototype.setWidget = function () {
    this.$container = $('<span>')
      .addClass('btn-group dropdown bsSelectpicker')
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

  Selectpicker.prototype.showWidget = function (e) {
    this.$selected = this.getSelectedOptionVal();
    this.$container.addClass('open');

    var _self = this;
    $(document).on('mousedown.bs.selectpicker, touchend.bs.selectpicker', function (e) {
      if (!(_self.$element.parent().find(e.target).length ||
          _self.$widget.is(e.target) ||
          _self.$widget.find(e.target).length)) {
        _self.hideWidget();
      }
    });
  };

  Selectpicker.prototype.hideWidget = function () {
    this.$container.removeClass('open');
  };

  Selectpicker.prototype.setVal = function (value) {
    if (value == '[object Object]') return;

    this.$element.val(value);
    this.options.onSetValCallback(value);

    if (this.$selected !== value.toString()) {
      this.$container
        .find('.' + this.options.optionSelectedClass)
        .removeClass(this.options.optionSelectedClass);
      this.$container
        .find("a[data-val='" + value + "']")
        .addClass(this.options.optionSelectedClass);
      this.options.onChangeCallback(this.$selected, value);
    }
  };

  Selectpicker.prototype.randomNumber = function () {
    return Math.floor((Math.random() * 100000) + 1);
  };

  Selectpicker.prototype.parseOptgroupsToHash = function () {
    var _self = this;
    var hash = {};

    this.$optgroups.each(function() {
      var optgroup = $(this);
      var first_option = optgroup.find('option').first().val();

      hash[first_option] = optgroup.attr('label');
    });

    return hash;
  };

  Selectpicker.prototype.parseOptionsToHash = function () {
    var _self = this;
    var array = [];

    this.$options.each(function() {
      var option = $(this);

      if (!_self.options.includePrompt && option.val() === '') return;

      var hash = {
        text: option.text(),
        value: option.val(),
        selected: (option.val() === _self.$selected)
      };

      if (option.val() === '') {
        hash.text = _self.options.text.prompt;
      }

      array.push(hash);
    });

    return array;
  };

  Selectpicker.prototype.getOptgroups = function () {
    return this.$element.find('optgroup');
  };

  Selectpicker.prototype.getOptions = function () {
    return this.$element.find('option');
  };

  Selectpicker.prototype.getSelectedOption = function () {
    return this.$element.find('option:selected');
  };

  Selectpicker.prototype.getSelectedOptionVal = function () {
    return this.getSelectedOption().val();
  };

  Selectpicker.prototype.optionCount = function () {
    return this.parseOptionsToHash().length;
  };

  Selectpicker.prototype.hasSelects = function () {
    return this.optionCount() !== 0;
  };

  Selectpicker.prototype.hasFuzzyAmount = function () {
    return this.optionCount() > 4;
  };

  Selectpicker.prototype.fuzzyTemplate = function () {
    var container = $('<div class="form-input form-size-s">');
    var textbox = $('<input type="text" placeholder="' + this.options.text.placeholder + '" id="' + this.$fuzzyId + '" autofocus>');

    container.append(textbox);

    var item = $(this.options.item);
    item.addClass('selectpicker-fuzzy list-skip-filter')
      .append(container);

    return item;
  };

  Selectpicker.prototype.optionClass = function (hash) {
    return this.options.optionHoverClass +
      (hash.selected ? (' ' + this.options.optionSelectedClass) : '');
  };

  Selectpicker.prototype.optgroupTemplate = function (label) {
    return '<li class="optgroup">' + label + '</li>';
  };

  Selectpicker.prototype.optionTemplate = function (hash) {
    return '<a href="#" class="' +
             this.optionClass(hash) +
             '" data-val="' +
             hash.value +
             '">' +
             hash.text +
             '</a>';
  };

  // SELECTPICKER PLUGIN DEFINITION
  // ==============================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.selectpicker');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.selectpicker', (data = new Selectpicker(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.selectpicker;

  $.fn.selectpicker = Plugin;
  $.fn.selectpicker.Constructor = Selectpicker;

  // SELECTPICKER NO CONFLICT
  // ========================

  $.fn.selectpicker.noConflict = function () {
    $.fn.selectpicker = old;
    return this;
  };

  // SELECTPICKER DATA-API
  // =====================

  $(document)
    .on('ready.bs.selectpicker.data-api', function () {
      $('[data-toggle="selectpicker"]').each(function () {
        var $this = $(this);
        if ($this.data('selectpicker')) return;
        Plugin.call($this, $this.data());
      });
    }).on('focus.bs.selectpicker.data-api click.bs.selectpicker.data-api', '[data-toggle="selectpicker"]', function (e) {
      var $this = $(this);
      if ($this.data('selectpicker')) return;
      Plugin.call($this, $this.data());
    });

}(jQuery);
