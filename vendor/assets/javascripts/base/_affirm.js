+function ($) {
  'use strict';

  // AFFIRM CLASS DEFINITION
  // =======================

  var Affirm = function (element, options) {
    this.$element = $(element);
    this.settings = {
      btnClass: {
        cancel: this.$element.data('btn-class-cancel') || Affirm.DEFAULTS.btnClass.cancel,
        confirm: this.$element.data('btn-class-confirm') || Affirm.DEFAULTS.btnClass.confirm
      },
      format: this.$element.data('format'),
      text: {
        cancel: this.$element.data('text-cancel') || Affirm.DEFAULTS.text.cancel,
        confirm: this.$element.data('text-confirm') || Affirm.DEFAULTS.text.confirm
      },
      title: this.$element.data('title')
    };
    this.options = $.extend({}, Affirm.DEFAULTS, this.settings, options);

    this.init();
  };

  if (!$.fn.modal) throw new Error('Affirm requires modal.js');
  if (!$.fn.popover) throw new Error('Affirm requires popover.js');

  Affirm.VERSION = '1.0.0';
  Affirm.DEFAULTS = {
    btnClass: {
      cancel: 'btn margin-size-right-xs',
      confirm: 'btn btn-color-red'
    },
    format: 'modal',
    onCancelCallback: function () {},
    onConfirmCallback: function () {},
    onDisplayCallback: function () {},
    text: {
      cancel: 'No, Cancel',
      confirm: 'Yes, Confirm'
    },
    title: 'Are you sure about this?'
  };

  Affirm.prototype.constructor = Affirm;

  Affirm.prototype.init = function () {
    var _self = this;
    var body = $('body');

    this.$element.click(function (e) {
      e.stopPropagation();
      e.preventDefault();

      _self.displayFormat();
      _self.options.onDisplayCallback();

      return false;
    });

    $('body')
      .on('click', '[data-affirm-toggle="cancel"]', function () {
        _self.cancelFormat();
        _self.options.onCancelCallback();
      })
      .on('click', '[data-affirm-toggle="confirm"]', function () {
        _self.confirmFormat();
        _self.options.onConfirmCallback();
      });
  };

  Affirm.prototype.cancelBtn = function () {
    var button = $('<a data-affirm-toggle="cancel" data-dismiss="modal">')
      .addClass(this.options.btnClass.cancel)
      .text(this.options.text.cancel);

    return button;
  };

  Affirm.prototype.confirmBtn = function () {
    var method = this.$element.attr('data-method');
    var target = this.$element.attr('target');
    var button = $('<a data-affirm-toggle="confirm">')
      .addClass(this.options.btnClass.confirm)
      .attr('href', this.$element.attr('href'))
      .text(this.options.text.confirm);

    if (method) button.attr('data-method', method);
    if (target) button.attr('target', target);

    return button;
  };

  Affirm.prototype.modalTemplate = function () {
    var title = '<h5 class="row">' + this.options.title + '</h5>';
    var header = $('<div class="modal-header text-align-left">')
      .append(title);
    var body = $('<div class="modal-body">')
      .append(this.$element.attr('data-affirm'));
    var footer = $('<div class="modal-footer text-align-right">')
      .append(this.cancelBtn())
      .append(this.confirmBtn());
    var modal = $('<div class="modal fade" role="modal">')
      .attr('id', 'bsAffirmModal')
      .append(header)
      .append(body)
      .append(footer);

    return modal;
  };

  Affirm.prototype.displayModal = function () {
    var modalId = '#bsAffirmModal';

    $(modalId).remove();
    $('body').append(this.modalTemplate());
    $(modalId).modal('show');
  };

  Affirm.prototype.popoverTemplate = function () {
    var cancelBtn = this.cancelBtn()
      .addClass('btn-size-s');
    var confirmBtn = this.confirmBtn()
      .addClass('btn-size-s');
    var navigation = $('<div class="popover-nav text-align-center row">')
      .append(cancelBtn)
      .append(confirmBtn);
    var popover = $('<div class="popover" role="tooltip">')
      .append('<div class="arrow"></div>')
      .append('<strong class="popover-title"></strong>')
      .append('<div class="popover-content"></div>')
      .append(navigation);

    return popover;
  };

  Affirm.prototype.displayPopover = function () {
    $('.popover').remove();

    this.$element.popover({
      container: false,
      content: this.$element.attr('data-affirm'),
      html: true,
      placement: 'top',
      title: this.options.title,
      template: this.popoverTemplate(),
      trigger: 'manual'
    });

    this.$element.popover('show');
  };

  Affirm.prototype.displayFormat = function () {
    if (this.options.format === 'popover') {
      this.displayPopover();
    } else {
      this.displayModal();
    }
  };

  Affirm.prototype.cancelFormat = function () {
    if (this.options.format === 'popover') this.$element.popover('hide');
  };

  Affirm.prototype.confirmFormat = function () {
    if (this.options.format === 'popover') {
      this.$element.popover('hide');
    } else {
      $('#bsAffirmModal').modal('hide');
    }
  };

  // AFFIRM PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affirm');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.affirm', (data = new Affirm(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.affirm;

  $.fn.affirm = Plugin;
  $.fn.affirm.Constructor = Affirm;

  // AFFIRM NO CONFLICT
  // ==================

  $.fn.affirm.noConflict = function () {
    $.fn.affirm = old;
    return this;
  };

  // AFFIRM DATA-API
  // ================

  $(document).on('ready.bs.affirm.data-api', function () {
    $('[data-affirm]').each(function () {
      var $this = $(this);
      Plugin.call($this, $this.data());
    });
  });

}(jQuery);
