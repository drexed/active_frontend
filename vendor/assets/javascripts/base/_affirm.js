+function ($) {
  'use strict';

  // AFFIRM CLASS DEFINITION
  // =======================

  var Affirm = function (element, options) {
    this.$element = $(element);
    this.settings = {
      title: this.$element.data('title'),
      offset: this.$element.data('offset'),
      removeClass: this.$element.data('remove-class')
    };
    this.options = $.extend({}, Affirm.DEFAULTS, options);

    this.init();
  };

  if (!$.fn.modal) throw new Error('Affirm requires modal.js');

  Affirm.VERSION = '1.0.0';
  Affirm.DEFAULTS = {
    btnClass: {
      cancel: 'btn margin-size-right-xs',
      confirm: 'btn btn-color-red'
    },
    modalClass: 'modal fade',
    modalId: 'bsAffirmModal',
    format: 'modal',
    text: {
      cancel: 'No, Cancel',
      confirm: 'Yes, Confirm'
    },
    title: 'Are you 100% sure about this?'
  };

  Affirm.prototype.constructor = Affirm;

  Affirm.prototype.init = function () {
    var _self = this;
    var body = $('body');
    var modalId = '#' + this.options.modalId;

    this.$element.click(function () {
      $(modalId).remove();
      body.append(_self.modalTemplate());
      $(modalId).modal('show');

      return false;
    });

    body.on('click', '[data-affirm-toggle="confirm"]', function () {
      $(modalId).modal('hide');
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
    var modal = $('<div role="modal">')
      .addClass(this.options.modalClass)
      .attr('id', this.options.modalId)
      .append(header)
      .append(body)
      .append(footer);

    return modal;
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
