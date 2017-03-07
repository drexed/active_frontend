+function ($) {
  'use strict';

  // TABLE CLASS DEFINITION
  // ======================

  var Table = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Table.DEFAULTS, options);

    this.init();
  };

  Table.VERSION = '1.0.0';
  Table.DEFAULTS = {
    onSortCallback: function (direction) {},
    templates: {
      downArrow: '<i class="icon-chevron-down pull-right"></i>',
      noArrow: '<i class="icon-minus pull-right"></i>',
      upArrow: '<i class="icon-chevron-up pull-right"></i>'
    }
  };

  Table.prototype.constructor = Table;

  Table.prototype.init = function () {
    this.setSortableColumns();
    this.setSortableClone();
  };

  Table.prototype.setSortableClone = function () {
    this.$container = $('<span>')
      .addClass('bsTableClone')
      .css({
        display: 'none',
        height: 0,
        position: 'absolute',
        width: 0
      });

    this.$container.append(this.$element.clone());
    this.$element.parent().append(this.$container);
  };

  Table.prototype.setSortableColumns = function () {
    var _self = this;

    this.$element.find('thead tr th').each(function () {
      var trTh = $(this);

      if (trTh.hasClass('no-sort') === false) {
        trTh.addClass('sort');

        _self.setSortStatus(trTh, 'sortable');
        _self.bindSortClick(trTh);
      }
    });
  };

  Table.prototype.setSortStatus = function (trTh, type) {
    trTh.attr('data-sort', type);

    var icon = trTh.find('.bsTableIcon').first();

    if (icon !== null) icon.remove();

    switch (type) {
      case 'up':
        icon = this.options.templates.upArrow;
        break;
      case 'down':
        icon = this.options.templates.downArrow;
        break;
      default:
        icon = this.options.templates.noArrow;
        break;
    }

    icon = $(icon).addClass('bsTableIcon');

    trTh.append(icon);
  };

  Table.prototype.bindSortClick = function (trTh) {
    var bindEvent = 'click';

    trTh.unbind(bindEvent);
    trTh.bind(bindEvent, this.initSortClick(trTh));
  };

  Table.prototype.initSortClick = function (trTh) {
    var _self = this;
    var table = this.$element;

    var sortClick = function () {
      var dataSort = trTh.attr('data-sort');
      var trThParentTh = trTh.parent().find('th');
      var reSort = 'sortable';

      trThParentTh.each(function () {
        var th = $(this);

        if (th.hasClass('no-sort') === false) _self.setSortStatus(th, 'sortable');
      });

      switch (dataSort) {
        case 'up':
          reSort = 'down';
          break;
        case 'down':
          reSort = 'sortable';
          break;
        default:
          reSort = 'up';
          break;
      }

      _self.options.onSortCallback(dataSort);
      _self.setSortStatus(trTh, reSort);

      var colIndex = 0;
      var sudoColIndex = 0;

      trThParentTh.each(function () {
        if ($(this).attr('data-sort') === reSort) {
          sudoColIndex = colIndex;
          return false;
        } else {
          colIndex++;
        }
      });

      var numeric = true;
      var clonedTable = _self.$container.find('table');
      var clonedTr = clonedTable.find('tbody tr');
      var clonedColVals = [];
      var clonedRowsMap = {};
      var i = 0;

      for (i = 0; i < clonedTr.length; i++) {
        var currentRow = clonedTable.find('tbody tr:eq(' + i + ')');
        var key = currentRow.children('td:eq(' + sudoColIndex + ')').html();

        if ($.isNumeric(key)) {
          var trailing_i;

          trailing_i = (i + 1) / (clonedTr.length + 1);
          trailing_i = trailing_i.toString();
          trailing_i = trailing_i.substr(2);

          if (key.indexOf('.') === -1) {
            key = key + '.' + trailing_i;
          } else {
            key = key + trailing_i;
          }
        } else {
          key = key + ':' + i;
          numeric = false;
        }

        clonedColVals.push(key);
        clonedRowsMap[key] = currentRow.clone();
      }

      if (reSort !== 'sortable') {
        if (numeric) {
          clonedColVals.sort(function (a, b) {
            return a - b;
          });
        } else {
          clonedColVals.sort();
        }

        if (reSort === 'up') clonedColVals.reverse();
      }

      var tbody = table.find('tbody');
      tbody.html('');

      for (i = 0; i < clonedColVals.length; i++) {
        tbody.append(clonedRowsMap[clonedColVals[i]]);
      }
    };

    return sortClick;
  };

  // TABLE PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.table');
      var options = typeof option === 'object' && option;

      if (!data) $this.data('bs.table', (data = new Table(this, options)));
      if (typeof option === 'string') data[option]();
    });
  }

  var old = $.fn.table;

  $.fn.table = Plugin;
  $.fn.table.Constructor = Table;

  // TABLE NO CONFLICT
  // =================

  $.fn.table.noConflict = function () {
    $.fn.table = old;
    return this;
  };

  // TABLE DATA-API
  // ==============

  $(document).on('ready.bs.table.data-api', function () {
    $('[data-toggle="table"]').each(function () {
      var $this = $(this);
      if ($this.data('table')) return;
      Plugin.call($this, $this.data());
    });
  });

}(jQuery);
