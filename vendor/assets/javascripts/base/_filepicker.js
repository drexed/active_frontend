+function ($) {
  'use strict';

  // FILEPICKER PUBLIC CLASS DEFINITION
  // ==================================

  var nextId = 0;
  var Filepicker = function (element, options) {
    this.$element = $(element);
    this.settings = {
      badgeClass: this.$element.data('badge-class') || Filepicker.DEFAULTS.badgeClass,
      buttonBefore: this.$element.data('button-before') || Filepicker.DEFAULTS.buttonBefore,
      buttonClass: this.$element.data('button-class') || Filepicker.DEFAULTS.buttonClass,
      buttonText: this.$element.data('button-text') || Filepicker.DEFAULTS.buttonText,
      disabled: this.$element.data('disabled') || Filepicker.DEFAULTS.disabled,
      iconClass: this.$element.data('icon-class') || Filepicker.DEFAULTS.iconClass,
      inputClass: this.$element.data('input-class') || Filepicker.DEFAULTS.inputClass,
      inputPlaceholder: this.$element.data('input-placeholder') || Filepicker.DEFAULTS.inputPlaceholder,
      showBadge: this.$element.data('show-badge') || Filepicker.DEFAULTS.showBadge,
      showIcon: this.$element.data('show-icon') || Filepicker.DEFAULTS.showIcon,
      showInput: this.$element.data('show-input') || Filepicker.DEFAULTS.showInput
    };
    this.options = $.extend({}, Filepicker.DEFAULTS, this.settings, options);

    this.$elementFilepicker = [];
    this.init();
  };

  Filepicker.VERSION = '1.0.0';
  Filepicker.DEFAULTS = {
    badgeClass: 'badge badge-color-black',
    buttonBefore: false,
    buttonClass: 'btn',
    buttonText: 'Browse',
    disabled: false,
    iconClass: 'icon-folder-open',
    inputClass: 'form-input',
    inputPlaceholder: 'Select a file...',
    onFilesDeselectedCallback: function () {},
    onFilesSelectedCallback: function (count) {},
    showBadge: true,
    showIcon: true,
    showInput: true
  };

  Filepicker.prototype.constructor = Filepicker;

  Filepicker.prototype.init = function () {
    var _self = this;
    var id = this.setId();
    var btn = this.setButton(id);
    var html = this.setHtml(btn);
    var container = this.setContainer(html);

    this.$elementFilepicker = $(container);
    this.$element
      .attr('tabindex', '-1')
      .css({
        'clip' : 'rect(0 0 0 0)',
        'position' : 'absolute',
        'width' : '0'
      })
      .after(this.$elementFilepicker);

    if (this.options.disabled) this.$element.attr('disabled', 'true');

    this.$element.change(function () {
      var files = _self.pushNameFiles();

      if (files.length === 0) {
        $.event.trigger('bs.filepicker.on-files-deselected');
        _self.options.onFilesDeselectedCallback();
      } else {
        $.event.trigger({
          type: 'bs.filepicker.on-files-selected',
          count: files.length
        });
        _self.options.onFilesSelectedCallback(files.length);
      }

      if (_self.options.showInput === false && _self.options.showBadge) {
        if (_self.$elementFilepicker.find('.badge').length === 0) {
          _self.badgeAppend(files);
        } else if (files.length === 0) {
          _self.badgeRemove();
        } else {
          _self.$elementFilepicker
            .find('.badge')
            .html(files.length);
        }
      } else {
        _self.badgeRemove();
      }
    });

    if (window.navigator.userAgent.search(/firefox/i) > -1) {
      this.$elementFilepicker.find('label').click(function () {
        _self.$element.click();
        return false;
      });
    }
  };

  Filepicker.prototype.badgeAppend = function (files) {
    var badge = ' <span class="' +
      this.options.badgeClass +
      '">' +
        files.length +
      '</span>';

    this.$elementFilepicker
      .find('label')
      .append(badge);
  };

  Filepicker.prototype.badgeRemove = function () {
    this.$elementFilepicker
      .find('.badge')
      .remove();
  };

  Filepicker.prototype.setButton = function (id) {
    return '<label for="' + id +
        '" class="' +
        this.options.buttonClass +
        '" ' +
        (this.options.disabled ? 'disabled="true"' : '') + '>' +
      this.htmlIcon() +
      '<span class="buttonText">' + this.options.buttonText + '</span>' +
    '</label>';
  };

  Filepicker.prototype.setId = function () {
    var id = this.$element.attr('id');

    if (id === '' || !id) {
      id = 'filepicker-' + nextId;
      this.$element.attr({ 'id': id });
      nextId++;
    }

    return id;
  };

  Filepicker.prototype.setHtml = function (btn) {
    return this.options.buttonBefore ?
      btn + this.htmlInput() :
      this.htmlInput() + btn;
  };

  Filepicker.prototype.setContainer = function (html) {
    return '<div class="filepicker ' +
      this.options.inputClass +
      (this.options.showInput === true ? ' with-form-addons' : '') +
      '">' +
        html +
      '</div>';
  };

  Filepicker.prototype.clearVal = function () {
    this.$elementFilepicker
      .find(':text')
      .val('');
  };

  Filepicker.prototype.htmlIcon = function () {
    if (this.options.showIcon) {
      return '<span class="icon-span-filepicker ' +
          this.options.iconClass +
        '"></span> ';
    } else {
      return '';
    }
  };

  Filepicker.prototype.htmlInput = function () {
    if (this.options.showInput) {
      return '<input type="text" placeholder="' +
          this.options.inputPlaceholder +
        '" disabled> ';
    } else {
      return '';
    }
  };

  Filepicker.prototype.pushNameFiles = function () {
    var content = '', files = [];
    if (this.$element[0].files === undefined) {
      files[0] = {
        name: this.$element[0] && this.$element[0].value
      };
    } else {
      files = this.$element[0].files;
    }

    for (var i = 0; i < files.length; i++) {
      content += files[i].name.split("\\").pop() + ', ';
    }

    if (content !== '') {
      this.$elementFilepicker
        .find(':text')
        .val(content.replace(/\, $/g, ''));
    } else {
      this.clearVal();;
    }

    return files;
  };

  // FILEPICKER PLUGIN DEFINITION
  // ============================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.filepicker');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.filepicker', (data = new Filepicker(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.filepicker;

  $.fn.filepicker = Plugin;
  $.fn.filepicker.Constructor = Filepicker;

  // FILEPICKER NO CONFLICT
  // =====================

  $.fn.filepicker.noConflict = function () {
    $.fn.filepicker = old;
    return this;
  };

  // FILEPICKER DATA-API
  // ==================

  $(document).on('ready.bs.filepicker.data-api', function () {
    $('[data-toggle="filepicker"]').each(function () {
      var $this = $(this);
      if ($this.data('filepicker')) return;
      Plugin.call($this, $this.data());
    });
  });

}(jQuery);
