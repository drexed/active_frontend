+function ($) {
  'use strict';

  // COLORPICKER PUBLIC CLASS DEFINITION
  // ===================================

  var Colorpicker = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Colorpicker.DEFAULTS, options);

    this.$active = false;
    this.$widget = $(this.initWidget()).on('click', $.proxy(this.clickWidget, this));

    this.init();
  };

  Colorpicker.VERSION = '1.0.0';
  Colorpicker.DEFAULTS = {
    colors: [
      '#7ac53d', '#4cbc34', '#1ecd93', '#167eff', '#805feb',
      '#9d5ed5', '#e86576', '#f43543', '#fc8323', '#f5ca09',
      '#0d202f', '#304455', '#697783', '#edf0f9', '#ffffff'
    ],
    item: '<li><button type="button"></button></li>',
    menu: '<ul class="colorpicker dropmenu caret"></ul>',
    onSetValCallback: function (color) {}
  };

  Colorpicker.prototype.constructor = Colorpicker;

  Colorpicker.prototype.init = function () {
    this.$element.on({
      'focus.bs.timepicker': $.proxy(this.showWidget, this),
      'click.bs.timepicker': $.proxy(this.showWidget, this),
      'blur.bs.timepicker': $.proxy(this.setVal, this)
    });
  };

  Colorpicker.prototype.clickWidget = function (e) {
    e.stopPropagation();
    e.preventDefault();

    var color = $(e.target).data('color');

    this.setVal(color);
  };

  Colorpicker.prototype.initWidget = function () {
    var _self = this;
    var menu = $(this.options.menu);

    $.each(this.options.colors, function (index, value) {
      var item = $(_self.options.item);

      item.find('button')
        .addClass('swatch bsColor')
        .css({ background: value })
        .data('color', value);

      menu.append(item);
    });

    return menu;
  };

  Colorpicker.prototype.showWidget = function () {
    if (this.$active) return;
    if (this.$element.prop('disabled') || this.$element.prop('readonly')) return;
    if (this.$widget.is(':visible')) return;

    this.$container = $('<span>')
      .addClass('btn-group dropdown open bsColorpicker')
      .css({
        height: 0,
        position: 'absolute',
        width: 0
      });

    this.$container.append(this.$widget);
    this.$element.after(this.$container);
    this.$active = true;

    var _self = this;
    $(document).on('mousedown.bs.colorpicker, touchend.bs.colorpicker', function (e) {
      if (!(_self.$element.parent().find(e.target).length ||
          _self.$widget.is(e.target) ||
          _self.$widget.find(e.target).length)) {
        _self.hideWidget();
      }
    });
  };

  Colorpicker.prototype.hideWidget = function () {
    if (!this.$active) return;
    if (!this.$widget.is(':visible')) return;

    $(document).off('mousedown.bs.colorpicker, touchend.bs.colorpicker');
    this.$widget.detach();
    this.$container.remove();
    this.$active = false;
  };

  Colorpicker.prototype.setVal = function (color) {
    if (color == '[object Object]') return;
    if (!this.$active) return;

    this.$element.val(color);
    $.event.trigger({
      type: 'bs.colorpicker.on-set-val',
      color: color
    });
    this.options.onSetValCallback(color);
  };

  // COLORPICKER PLUGIN DEFINITION
  // =============================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.colorpicker');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.colorpicker', (data = new Colorpicker(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.colorpicker;

  $.fn.colorpicker = Plugin;
  $.fn.colorpicker.Constructor = Colorpicker;

  // COLORPICKER NO CONFLICT
  // =======================

  $.fn.colorpicker.noConflict = function () {
    $.fn.colorpicker = old;
    return this;
  };

  // COLORPICKER DATA-API
  // ====================

  $(document).on('focus.bs.colorpicker.data-api click.bs.colorpicker.data-api', '[data-toggle="colorpicker"]', function (e) {
    var $this = $(this);
    if ($this.data('colorpicker')) return;
    Plugin.call($this, $this.data());
  });

}(jQuery);
