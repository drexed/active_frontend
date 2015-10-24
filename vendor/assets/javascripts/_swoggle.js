(function() {
  var __slice = [].slice;

  (function($, window) {
    "use strict";
    var swoggle;
    swoggle = (function() {
      swoggle.prototype.defaults = {
        state: true,
        size: null,
        animate: true,
        disabled: false,
        readonly: false,
        onColor: "green",
        offColor: null,
        onText: "",
        offText: "",
        labelText: "&nbsp;"
      };

      swoggle.prototype.name = "swoggle";

      function swoggle(element, options) {
        if (options == null) {
          options = {};
        }
        this.$element = $(element);
        this.options = $.extend({}, this.defaults, options, {
          state: this.$element.is(":checked"),
          size: this.$element.data("size"),
          animate: this.$element.data("animate"),
          disabled: this.$element.is(":disabled"),
          readonly: this.$element.is("[readonly]"),
          onColor: this.$element.data("on-color"),
          offColor: this.$element.data("off-color"),
          onText: this.$element.data("on-text"),
          offText: this.$element.data("off-text"),
          labelText: this.$element.data("label-text")
        });
        this.$on = $("<span>", {
          "class": "" + this.name + "-handle-on " + this.name + "-" + this.options.onColor,
          html: this.options.onText
        });
        this.$off = $("<span>", {
          "class": "" + this.name + "-handle-off " + this.name + "-" + this.options.offColor,
          html: this.options.offText
        });
        this.$label = $("<label>", {
          "for": this.$element.attr("id"),
          html: this.options.labelText
        });
        this.$wrapper = $("<div>", {
          "class": (function(_this) {
            return function() {
              var classes;
              classes = ["" + _this.name];
              classes.push(_this.options.state ? "" + _this.name + "-on" : "" + _this.name + "-off");
              if (_this.options.size != null) {
                classes.push("" + _this.name + "-" + _this.options.size);
              }
              if (_this.options.onColor != null) {
                classes.push("" + _this.name + "-" + _this.options.onColor);
              }
              if (_this.options.animate) {
                classes.push("" + _this.name + "-animate");
              }
              if (_this.options.disabled) {
                classes.push("" + _this.name + "-disabled");
              }
              if (_this.options.readonly) {
                classes.push("" + _this.name + "-readonly");
              }
              if (_this.$element.attr("id")) {
                classes.push("" + _this.name + "-id-" + (_this.$element.attr("id")));
              }
              return classes.join(" ");
            };
          })(this)
        });
        this.$div = this.$element.wrap($("<div>")).parent();
        this.$wrapper = this.$div.wrap(this.$wrapper).parent();
        this.$element.before(this.$on).before(this.$label).before(this.$off);
        this._elementHandlers();
        this._handleHandlers();
        this._labelHandlers();
        this._formHandler();
      }

      swoggle.prototype._constructor = swoggle;

      swoggle.prototype.state = function(value, skip) {
        if (typeof value === "undefined") {
          return this.options.state;
        }
        if (this.options.disabled || this.options.readonly) {
          return this.$element;
        }
        value = !!value;
        this.$element.prop("checked", value).trigger("change.swoggle", skip);
        return this.$element;
      };

      swoggle.prototype.toggleState = function(skip) {
        if (this.options.disabled || this.options.readonly) {
          return this.$element;
        }
        return this.$element.prop("checked", !this.options.state).trigger("change.swoggle", skip);
      };

      swoggle.prototype.size = function(value) {
        if (typeof value === "undefined") {
          return this.options.size;
        }
        if (this.options.size != null) {
          this.$wrapper.removeClass("" + this.name + "-" + this.options.size);
        }
        this.$wrapper.addClass("" + this.name + "-" + value);
        this.options.size = value;
        return this.$element;
      };

      swoggle.prototype.animate = function(value) {
        if (typeof value === "undefined") {
          return this.options.animate;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.name + "-animate");
        this.options.animate = value;
        return this.$element;
      };

      swoggle.prototype.disabled = function(value) {
        if (typeof value === "undefined") {
          return this.options.disabled;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.name + "-disabled");
        this.$element.prop("disabled", value);
        this.options.disabled = value;
        return this.$element;
      };

      swoggle.prototype.toggleDisabled = function() {
        this.$element.prop("disabled", !this.options.disabled);
        this.$wrapper.toggleClass("" + this.name + "-disabled");
        this.options.disabled = !this.options.disabled;
        return this.$element;
      };

      swoggle.prototype.readonly = function(value) {
        if (typeof value === "undefined") {
          return this.options.readonly;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.name + "-readonly");
        this.$element.prop("readonly", value);
        this.options.readonly = value;
        return this.$element;
      };

      swoggle.prototype.toggleReadonly = function() {
        this.$element.prop("readonly", !this.options.readonly);
        this.$wrapper.toggleClass("" + this.name + "-readonly");
        this.options.readonly = !this.options.readonly;
        return this.$element;
      };

      swoggle.prototype.onColor = function(value) {
        var color;
        color = this.options.onColor;
        if (typeof value === "undefined") {
          return color;
        }
        if (color != null) {
          this.$on.removeClass("" + this.name + "-" + color);
        }
        this.$on.addClass("" + this.name + "-" + value);
        this.options.onColor = value;
        return this.$element;
      };

      swoggle.prototype.offColor = function(value) {
        var color;
        color = this.options.offColor;
        if (typeof value === "undefined") {
          return color;
        }
        if (color != null) {
          this.$off.removeClass("" + this.name + "-" + color);
        }
        this.$off.addClass("" + this.name + "-" + value);
        this.options.offColor = value;
        return this.$element;
      };

      swoggle.prototype.onText = function(value) {
        if (typeof value === "undefined") {
          return this.options.onText;
        }
        this.$on.html(value);
        this.options.onText = value;
        return this.$element;
      };

      swoggle.prototype.offText = function(value) {
        if (typeof value === "undefined") {
          return this.options.offText;
        }
        this.$off.html(value);
        this.options.offText = value;
        return this.$element;
      };

      swoggle.prototype.labelText = function(value) {
        if (typeof value === "undefined") {
          return this.options.labelText;
        }
        this.$label.html(value);
        this.options.labelText = value;
        return this.$element;
      };

      swoggle.prototype.destroy = function() {
        var $form;
        $form = this.$element.closest("form");
        if ($form.length) {
          $form.off("reset.swoggle").removeData("swoggle");
        }
        this.$div.children().not(this.$element).remove();
        this.$element.unwrap().unwrap().off(".swoggle").removeData("swoggle");
        return this.$element;
      };

      swoggle.prototype._elementHandlers = function() {
        return this.$element.on({
          "change.swoggle": (function(_this) {
            return function(e, skip) {
              var checked;
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              checked = _this.$element.is(":checked");
              if (checked === _this.options.state) {
                return;
              }
              _this.options.state = checked;
              _this.$wrapper.removeClass(checked ? "" + _this.name + "-off" : "" + _this.name + "-on").addClass(checked ? "" + _this.name + "-on" : "" + _this.name + "-off");
              if (!skip) {
                if (_this.$element.is(":radio")) {
                  $("[name='" + (_this.$element.attr('name')) + "']").not(_this.$element).prop("checked", false).trigger("change.swoggle", true);
                }
                return _this.$element.trigger("switchChange", {
                  el: _this.$element,
                  value: checked
                });
              }
            };
          })(this),
          "focus.swoggle": (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return _this.$wrapper.addClass("" + _this.name + "-focused");
            };
          })(this),
          "blur.swoggle": (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return _this.$wrapper.removeClass("" + _this.name + "-focused");
            };
          })(this),
          "keydown.swoggle": (function(_this) {
            return function(e) {
              if (!e.which || _this.options.disabled || _this.options.readonly) {
                return;
              }
              switch (e.which) {
                case 32:
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  return _this.toggleState();
                case 37:
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  return _this.state(false);
                case 39:
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  return _this.state(true);
              }
            };
          })(this)
        });
      };

      swoggle.prototype._handleHandlers = function() {
        this.$on.on("click.swoggle", (function(_this) {
          return function(e) {
            _this.state(false);
            return _this.$element.trigger("focus.swoggle");
          };
        })(this));
        return this.$off.on("click.swoggle", (function(_this) {
          return function(e) {
            _this.state(true);
            return _this.$element.trigger("focus.swoggle");
          };
        })(this));
      };

      swoggle.prototype._labelHandlers = function() {
        return this.$label.on({
          "mousemove.swoggle": (function(_this) {
            return function(e) {
              var left, percent, right;
              if (!_this.drag) {
                return;
              }
              percent = ((e.pageX - _this.$wrapper.offset().left) / _this.$wrapper.width()) * 100;
              left = 25;
              right = 75;
              if (percent < left) {
                percent = left;
              } else if (percent > right) {
                percent = right;
              }
              _this.$div.css("margin-left", "" + (percent - right) + "%");
              return _this.$element.trigger("focus.swoggle");
            };
          })(this),
          "mousedown.swoggle": (function(_this) {
            return function(e) {
              if (_this.drag || _this.options.disabled || _this.options.readonly) {
                return;
              }
              _this.drag = true;
              if (_this.options.animate) {
                _this.$wrapper.removeClass("" + _this.name + "-animate");
              }
              return _this.$element.trigger("focus.swoggle");
            };
          })(this),
          "mouseup.swoggle": (function(_this) {
            return function(e) {
              if (!_this.drag) {
                return;
              }
              _this.drag = false;
              _this.$element.prop("checked", parseInt(_this.$div.css("margin-left"), 10) > -25).trigger("change.swoggle");
              _this.$div.css("margin-left", "");
              if (_this.options.animate) {
                return _this.$wrapper.addClass("" + _this.name + "-animate");
              }
            };
          })(this),
          "click.swoggle": (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopImmediatePropagation();
              _this.toggleState();
              return _this.$element.trigger("focus.swoggle");
            };
          })(this)
        });
      };

      swoggle.prototype._formHandler = function() {
        var $form;
        $form = this.$element.closest("form");
        if ($form.data("swoggle")) {
          return;
        }
        return $form.on("reset.swoggle", function() {
          return window.setTimeout(function() {
            return $form.find("input").filter(function() {
              return $(this).data("swoggle");
            }).each(function() {
              return $(this).swoggle("state", false);
            });
          }, 1);
        }).data("swoggle", true);
      };

      return swoggle;

    })();
    $.fn.extend({
      swoggle: function() {
        var args, option, ret;
        option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        ret = this;
        this.each(function() {
          var $this, data;
          $this = $(this);
          data = $this.data("swoggle");
          if (!data) {
            $this.data("swoggle", data = new swoggle(this, option));
          }
          if (typeof option === "string") {
            return ret = data[option].apply(data, args);
          }
        });
        return ret;
      }
    });
    return $.fn.swoggle.Constructor = swoggle;
  })(window.jQuery, window);

}).call(this);