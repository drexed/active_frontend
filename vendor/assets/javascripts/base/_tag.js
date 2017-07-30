+function ($) {
  'use strict';

  // TAG CLASS DEFINITION
  // ====================

  var Tag = function (element, options) {
    this.isInit = true;
    this.itemsArray = [];
    this.$element = $(element);
    this.$element.hide();
    this.isSelect = (element.tagName === 'SELECT');
    this.multiple = (this.isSelect && element.hasAttribute('multiple'));
    this.objectItems = options && options.itemValue;
    this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
    this.inputSize = Math.max(1, this.placeholderText.length);
    this.$container = $('<div class="form-tags"></div>');
    this.$input = $('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);
    this.$element.before(this.$container);
    this.build(options);
    this.moveLabel();
    this.isInit = false;
  };

  Tag.VERSION = '1.0.0';
  Tag.DEFAULTS = {
    itemText: function(item) {
      return this.itemValue(item);
    },
    itemTitle: function(item) {
      return null;
    },
    itemValue: function(item) {
      return item ? item.toString() : item;
    },
    onTagExists: function(item, $tag) {},
    tagClass: function(item) {
      return 'label label-color-primary label-color-inverted';
    },
    addOnBlur: true,
    allowDuplicates: false,
    cancelConfirmKeysOnEmpty: false,
    confirmKeys: [13, 44],
    delimiter: ', ',
    delimiterRegex: null,
    focusClass: 'focus',
    freeInput: true,
    maxChars: undefined,
    maxTags: undefined,
    triggerChange: true,
    trimValue: true
  };

  Tag.prototype.constructor = Tag;

  Tag.prototype.stopTimer = function () {
    return clearTimeout(this.interval);
  };

  Tag.prototype.getHtmlAttributes = function (item) {
    if (this.options.itemAttributes === undefined) return '';

    var res = ' ';
    var itemAttributes = this.options.itemAttributes;

    for (var e in itemAttributes) {
      if (typeof itemAttributes[e] !== 'function') {
        res += e + '="' + itemAttributes[e].toString() + '"';
      } else {
        res += e + '="' + itemAttributes[e](item) + '"';
      }
    }

    return res;
  };

  Tag.prototype.add = function(item, dontPushVal, options) {
    var _self = this;

    if (_self.options.maxTags && _self.itemsArray.length >= _self.options.maxTags) return;
    if (item !== false && !item) return;

    if (typeof item === "string" && _self.options.trimValue) {
      item = $.trim(item);
    }

    if (typeof item === 'object' && !_self.objectItems) throw("Can't add objects when itemValue option is not set");
    if (item.toString().match(/^\s*$/)) return;
    if (_self.isSelect && !_self.multiple && _self.itemsArray.length > 0) _self.remove(_self.itemsArray[0]);

    if (typeof item === 'string' && this.$element[0].tagName === 'INPUT') {
      var delimiter = (_self.options.delimiterRegex) ? _self.options.delimiterRegex : _self.options.delimiter;
      var items = item.split(delimiter);

      if (items.length > 1) {
        for (var i = 0; i < items.length; i++) {
          this.add(items[i], true);
        }

        if (!dontPushVal) _self.pushVal(_self.options.triggerChange);

        return;
      }
    }

    var itemValue = _self.options.itemValue(item);
    var itemText = _self.options.itemText(item);
    var tagClass = _self.options.tagClass(item);
    var itemTitle = _self.options.itemTitle(item);

    var existing = $.grep(_self.itemsArray, function(item) {
      return _self.options.itemValue(item) === itemValue;
    })[0];

    if (existing && !_self.options.allowDuplicates) {
      if (_self.options.onTagExists) {
        var $existingTag = $('.tag', _self.$container).filter(function () {
          return $(this).data('item') === existing;
        });

        _self.options.onTagExists(item, $existingTag);
      }

      return;
    }

    if (_self.items().toString().length + item.length + 1 > _self.options.maxInputLength) return;

    var beforeItemAddEvent = $.Event('beforeItemAdd', {
      item: item,
      cancel: false,
      options: options
    });

    _self.$element.trigger(beforeItemAddEvent);

    if (beforeItemAddEvent.cancel) return;

    _self.itemsArray.push(item);

    var attrs = _self.getHtmlAttributes(item);
    var $tag = $('<span ' +
                 _self.htmlEncode(attrs) +
                 ' class="tag ' +
                 _self.htmlEncode(tagClass) +
                 (itemTitle !== null ? ('" title="' + itemTitle) : '') +
                 '">' +
                 _self.htmlEncode(itemText) +
                 '<span data-role="remove"></span></span>');

    $tag.data('item', item);

    _self.findInputWrapper()
      .before($tag);

    $tag.after(' ');

    var optionExists = (
      $('option[value="' + encodeURIComponent(itemValue) + '"]', _self.$element).length ||
      $('option[value="' + _self.htmlEncode(itemValue) + '"]', _self.$element).length
    );

    if (_self.isSelect && !optionExists) {
      var $option = $('<option selected>' + _self.htmlEncode(itemText) + '</option>');

      $option.data('item', item)
        .attr('value', itemValue);
      _self.$element.append($option);
    }

    if (!dontPushVal) _self.pushVal(_self.options.triggerChange);

    if (_self.options.maxTags === _self.itemsArray.length || _self.items().toString().length === _self.options.maxInputLength) {
      _self.$container
        .addClass('form-tags-max');
    }

    if ($('.typeahead', _self.$container).length) {
      setTimeout(function () {
        _self.$input.val('');
      }, 0);
    }

    if (this.isInit) {
      _self.$element.trigger($.Event('itemAddedOnInit', {
        item: item,
        options: options
      }));
    } else {
      _self.$element.trigger($.Event('itemAdded', {
        item: item,
        options: options
      }));
    }
  };

  Tag.prototype.remove = function(item, dontPushVal, options) {
    var _self = this;

    if (_self.objectItems) {
      if (typeof item === 'object') {
        item = $.grep(_self.itemsArray, function (other) {
          return _self.options.itemValue(other) === _self.options.itemValue(item);
        });
      } else {
        item = $.grep(_self.itemsArray, function (other) {
          return _self.options.itemValue(other) ===  item;
        });
      }

      item = item[item.length-1];
    }

    if (item) {
      var beforeItemRemoveEvent = $.Event('beforeItemRemove', {
        item: item,
        cancel: false,
        options: options
      });

      _self.$element.trigger(beforeItemRemoveEvent);

      if (beforeItemRemoveEvent.cancel) return;

      $('.tag', _self.$container).filter(function () {
        return $(this).data('item') === item;
      }).remove();
      $('option', _self.$element).filter(function () {
        return $(this).data('item') === item;
      }).remove();

      if ($.inArray(item, _self.itemsArray) !== -1) _self.itemsArray.splice($.inArray(item, _self.itemsArray), 1);
    }

    if (!dontPushVal) _self.pushVal(_self.options.triggerChange);

    if (_self.options.maxTags > _self.itemsArray.length) _self.$container.removeClass('form-tags-max');

    _self.$element
      .trigger($.Event('itemRemoved',  {
        item: item,
        options: options
      }));
  };

  Tag.prototype.removeAll = function() {
    $('.tag', this.$container).remove();
    $('option', this.$element).remove();

    while(this.itemsArray.length > 0) this.itemsArray.pop();

    this.pushVal(this.options.triggerChange);
  };

  Tag.prototype.refresh = function() {
    var _self = this;

    $('.tag', _self.$container).each(function() {
      var $tag = $(this);
      var item = $tag.data('item');
      var itemValue = _self.options.itemValue(item);
      var itemText = _self.options.itemText(item);
      var tagClass = _self.options.tagClass(item);

      $tag.attr('class', null);
      $tag.addClass('tag ' + _self.htmlEncode(tagClass));
      $tag.contents()
          .filter(function () {
        return this.nodeType == 3;
      })[0].nodeValue = _self.htmlEncode(itemText);

      if (_self.isSelect) {
        var option = $('option', _self.$element).filter(function () {
          return $(this).data('item') === item;
        });

        option.attr('value', itemValue);
      }
    });
  };

  Tag.prototype.items = function() {
    return this.itemsArray;
  };

  Tag.prototype.pushVal = function() {
    var _self = this;
    var val = $.map(_self.items(), function (item) {
      return _self.options.itemValue(item).toString();
    });

    _self.$element.val(val, true);

    if (_self.options.triggerChange) _self.$element.trigger('change');
  };

  Tag.prototype.moveLabel = function () {
    var label = this.$element.next('label');

    if (label.length) label.insertAfter(this.$container);
  };

  Tag.prototype.build = function(options) {
    var _self = this;

    _self.options = $.extend({}, Tag.DEFAULTS, options);

    if (_self.objectItems) _self.options.freeInput = false;

    _self.makeOptionItemFunction(_self.options, 'itemValue');
    _self.makeOptionItemFunction(_self.options, 'itemText');
    _self.makeOptionFunction(_self.options, 'tagClass');

    if (_self.$element.data('source') || _self.options.typeahead) {
      var typeahead = _self.$element.data('source');

      if (typeahead === undefined) {
        typeahead = _self.options.typeahead || {};
      } else {
        typeahead = { source: typeahead };
      }

      _self.makeOptionFunction(typeahead, 'source');

      _self.$input.typeahead($.extend({}, typeahead, {
        source: function (query, process) {
          function processItems(items) {
            var texts = [];

            for (var i = 0; i < items.length; i++) {
              var text = _self.options.itemText(items[i]);
              map[text] = items[i];
              texts.push(text);
            }
            process(texts);
          }

          this.map = {};
          var map = this.map;
          var data = typeahead.source(query);

          $.when(data).then(processItems);
        },
        updater: function (text) {
          _self.add(this.map[text]);
          return this.map[text];
        },
        matcher: function (text) {
          return (text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1);
        },
        sorter: function (texts) {
          return texts.sort();
        },
        highlighter: function (text) {
          var i = text.indexOf('<small');
          var old = '';

          if (i > 0) {
            old = text.substring(i, text.length);
            text = text.substring(0, i - 1);
          }

          var regex = new RegExp('(' + this.query + ')', 'gi');
          return text.replace(regex, '<strong>$1</strong>') + old;
        }
      }));
    }

    _self.$container.on('click', $.proxy(function(event) {
      if (! _self.$element.attr('disabled')) _self.$input.removeAttr('disabled');

      _self.$input.focus();
    }, _self));

    if (_self.options.addOnBlur && _self.options.freeInput) {
      _self.$input.on('focusout', $.proxy(function(event) {
        if ($('.typeahead', _self.$container).length === 0) {
          _self.add(_self.$input.val());
          _self.$input.val('');
        }
      }, _self));
    }

    _self.$container.on({
      focusin: function() {
        _self.$container.addClass(_self.options.focusClass);
      },
      focusout: function() {
        _self.$container.removeClass(_self.options.focusClass);
      },
    });

    _self.$container.on('keydown input', 'input', $.proxy(function(event) {
      var $input = $(event.target);
      var $inputWrapper = _self.findInputWrapper();

      if (_self.$element.attr('disabled')) {
        _self.$input.attr('disabled', 'disabled');
        return;
      }

      switch (event.which) {
        case 8:
          if (_self.doGetCaretPosition($input[0]) === 0) {
            var prev = $inputWrapper.prev();

            if (prev.length) _self.remove(prev.data('item'));
          }
          break;
        case 46:
          if (_self.doGetCaretPosition($input[0]) === 0) {
            var next = $inputWrapper.next();

            if (next.length) _self.remove(next.data('item'));
          }
          break;
        case 37:
          var $prevTag = $inputWrapper.prev();

          if ($input.val().length === 0 && $prevTag[0]) {
            $prevTag.before($inputWrapper);
            $input.focus();
          }
          break;
        case 39:
          var $nextTag = $inputWrapper.next();

          if ($input.val().length === 0 && $nextTag[0]) {
            $nextTag.after($inputWrapper);
            $input.focus();
          }
          break;
       default:
           // ignore
       }

      var textLength = $input.val().length;
      var wordSpace = Math.ceil(textLength / 5);
      var size = textLength + wordSpace + 1;

      $input.attr('size', Math.max(this.inputSize, $input.val().length));
    }, _self));

    _self.$container.on('keypress', 'input', $.proxy(function(event) {
       var $input = $(event.target);

       if (_self.$element.attr('disabled')) {
          _self.$input.attr('disabled', 'disabled');
          return;
       }

       var text = $input.val();
       var maxLengthReached = _self.options.maxChars && text.length >= _self.options.maxChars;

       if (_self.options.freeInput && (_self.keyCombinationInList(event, _self.options.confirmKeys) || maxLengthReached)) {
         if (text.length !== 0) {
           _self.add(maxLengthReached ? text.substr(0, _self.options.maxChars) : text);
           $input.val('');
         }

         if (_self.options.cancelConfirmKeysOnEmpty === false) event.preventDefault();
       }

       var textLength = $input.val().length;
       var wordSpace = Math.ceil(textLength / 5);
       var size = textLength + wordSpace + 1;

       $input.attr('size', Math.max(this.inputSize, $input.val().length));
    }, _self));

    _self.$container.on('click', '[data-role=remove]', $.proxy(function(event) {
      if (_self.$element.attr('disabled')) return;

      _self.remove($(event.target).closest('.tag').data('item'));
    }, _self));

    if (_self.options.itemValue === Tag.DEFAULTS.itemValue) {
      if (_self.$element[0].tagName === 'INPUT') {
        _self.add(_self.$element.val());
      } else {
        $('option', _self.$element).each(function() {
          _self.add($(this).attr('value'), true);
        });
      }
    }
  };

  Tag.prototype.destroy = function() {
    var _self = this;

    this.$container
      .off('keypress', 'input')
      .off('click', '[role=remove]')
      .remove();

    this.$element
      .removeData('tagsinput')
      .show();
  };

  Tag.prototype.focus = function() {
    this.$input.focus();
  };

  Tag.prototype.input = function() {
    return this.$input;
  };

  Tag.prototype.findInputWrapper = function() {
    var elt = this.$input[0];
    var container = this.$container[0];

    while (elt && elt.parentNode !== container) {
      elt = elt.parentNode;
    }

    return $(elt);
  };

  Tag.prototype.makeOptionItemFunction = function (options, key) {
    if (typeof options[key] !== 'function') {
      var propertyName = options[key];

      options[key] = function(item) {
        return item[propertyName];
      };
    }
  };

  Tag.prototype.makeOptionFunction = function (options, key) {
    if (typeof options[key] !== 'function') {
      var value = options[key];

      options[key] = function() {
        return value;
      };
    }
  };

  Tag.prototype.doGetCaretPosition = function (oField) {
    var iCaretPos = 0;

    if (document.selection) {
      oField.focus ();

      var oSel = document.selection.createRange();

      oSel.moveStart('character', -oField.value.length);

      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }

    return (iCaretPos);
  };

  Tag.prototype.keyCombinationInList = function (keyPressEvent, lookupList) {
    var found = false;

    $.each(lookupList, function (index, keyCombination) {
      if (typeof (keyCombination) === 'number' && keyPressEvent.which === keyCombination) {
        found = true;
        return false;
      }

      if (keyPressEvent.which === keyCombination.which) {
        var alt = !keyCombination.hasOwnProperty('altKey') || keyPressEvent.altKey === keyCombination.altKey;
        var shift = !keyCombination.hasOwnProperty('shiftKey') || keyPressEvent.shiftKey === keyCombination.shiftKey;
        var ctrl = !keyCombination.hasOwnProperty('ctrlKey') || keyPressEvent.ctrlKey === keyCombination.ctrlKey;

        if (alt && shift && ctrl) {
          found = true;
          return false;
        }
      }
    });

    return found;
  };

  Tag.prototype.htmlEncode = function (value) {
    if (value) {
      return $('<div />').text(value).html();
    } else {
      return '';
    }
  };

  // TAG PLUGIN DEFINITION
  // =====================

  function Plugin(arg1, arg2, arg3) {
    var results = [];

    this.each(function () {
      var _self = $(this);
      var tagsinput = _self.data('tagsinput');

      if (!tagsinput) {
        tagsinput = new Tag(this, arg1);

        _self.data('tagsinput', tagsinput);

        results.push(tagsinput);

        if (this.tagName === 'SELECT') $('option', _self).attr('selected', 'selected');

        _self.val(_self.val());
      } else if (!arg1 && !arg2) {
        results.push(tagsinput);
      } else if (tagsinput[arg1] !== undefined) {
        var retVal;

        if (tagsinput[arg1].length === 3 && arg3 !== undefined){
          retVal = tagsinput[arg1](arg2, null, arg3);
        } else {
          retVal = tagsinput[arg1](arg2);
        }

        if (retVal !== undefined) results.push(retVal);
      }
    });

    if (typeof arg1 === 'string') {
      return results.length > 1 ? results : results[0];
    } else {
      return results;
    }
  }

  var old = $.fn.tag;

  $.fn.tag = Plugin;
  $.fn.tag.Constructor = Tag;

  // TAG NO CONFLICT
  // ===============

  $.fn.tag.noConflict = function () {
    $.fn.tag = old;
    return this;
  };

  // TAG DATA-API
  // ============

  $(document).on('ready.bs.tag.data-api', function () {
    $('[data-toggle="tag"]').each(function () {
      var $this = $(this);
      if ($this.data('tag')) return;
      Plugin.call($this, $this.data());
    });
  });

}(jQuery);
