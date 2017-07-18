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
      '#A4D96F', '#34D066', '#42DFC1', '#329CFF', '#9270E2',
      '#C26FD4', '#F0818F', '#F15B53', '#FCAE46', '#F8D648',
      '#2C3A49', '#7890A2', '#EEF1FA', '#FFFFFF'
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
