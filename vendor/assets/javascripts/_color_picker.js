(function($) {
  "use strict";

  var ColorPicker = function(select, options) {
    this.options = options;
    this.$select = $(select);
    this._init();
  };

  ColorPicker.prototype = {

    constructor : ColorPicker,

    _init : function() {
      var callback    = this.options.callback;
      var selectValue = this.$select.val();
      var selectColor = this.$select.find("option:selected").data("color");

      var $markupUl   = $("<ul>").addClass("dropdown-menu").addClass("dropdown-caret");
      var $markupDiv  = $("<div>").addClass("dropdown").addClass("dropdown-colorpicker");
      var $markupSpan = $("<span>").addClass("dropdown-swatch").css("background", selectColor);
      var $markupA    = $("<a>").attr("data-toggle", "dropdown").addClass("dropdown-toggle").attr("href", "#").append($markupSpan);

      $("option", this.$select).each(function() {
        var option = $(this);
        var value  = option.attr("value");
        var color  = option.data("color");
        var title  = option.text();

        var $markupA = $("<a>").addClass("colorpicker-swatch");
        if (option.prop("selected") === true || selectValue === color) {
          $markupA.addClass("selected");
        }
        $markupA.css("background", color);
        $markupA.attr("href", "#").attr("data-color", color).attr("data-value", value).attr("title", title);

        $markupUl.append($("<li>").append($markupA));
      });

      $markupDiv.append($markupA);
      $markupDiv.append($markupUl);

      this.$select.hide();
      this.$selector = $($markupDiv).insertAfter(this.$select);
      this.$select.on("change", function() {
        var value = $(this).val();
        var color = $(this).find("option[value='" + value + "']").data("color");
        var title = $(this).find("option[value='" + value + "']").text();

        $(this).next().find("ul").find("li").find(".selected").removeClass("selected");
        $(this).next().find("ul").find("li").find("a[data-color='" + color + "']").addClass("selected");
        $(this).next().find(".dropdown-swatch").css("background", color);

        callback(value, color, title);
      });

      $markupUl.on('click.colorpicker', $.proxy(this._clickColor, this));
    },

    _clickColor : function(e) {
      var a = $(e.target);

      if (!a.is(".colorpicker-swatch")) {
        return false;
      }

      this.$select.val(a.data("value")).change();

      e.preventDefault();
      return true;
    },

    setColor : function(color) {
      var value = $(this.$selector).find("li").find("a[data-color='" + color + "']").data("value");
      this.setValue(value);
    },

    setValue : function(value) {
      this.$select.val(value).change();
    },

  };

  $.fn.colorpicker = function(option) {
    var args = Array.apply(null, arguments);
    args.shift();

    return this.each(function() {
      var $this = $(this), data = $this.data("colorpicker"), options = $.extend({}, $.fn.colorpicker.defaults, $this.data(), typeof option == "object" && option);

      if (!data) {
        $this.data("colorpicker", (data = new ColorPicker(this, options)));
      }

      if (typeof option == "string") {
        data[option].apply(data, args);
      }
    });
  };

  $.fn.colorpicker.defaults = {
    callback : function(value, color, title) {
    },
    colorsPerRow : 8
  };

  $.fn.colorpicker.Constructor = ColorPicker;

})(jQuery, window, document);