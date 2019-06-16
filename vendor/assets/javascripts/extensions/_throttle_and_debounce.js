(function (window, undefined) {
  '$:nomunge';

  var $ = window.jQuery;

  $.throttle = function(delay, no_trailing, callback, debounce_mode) {
    var last_exec = 0;
    var timeout_id;

    if (typeof no_trailing !== 'boolean') {
      debounce_mode = callback;
      callback = no_trailing;
      no_trailing = undefined;
    }

    function wrapper() {
      var that = this;
      var elapsed = +new Date() - last_exec;
      var args = arguments;

      function exec() {
        last_exec = +new Date();
        callback.apply( that, args );
      }

      function clear() {
        timeout_id = undefined;
      }

      if (debounce_mode && !timeout_id) exec();

      timeout_id && clearTimeout(timeout_id);

      if (debounce_mode === undefined && elapsed > delay) {
        exec();
      } else if (no_trailing !== true) {
        timeout_id = setTimeout(debounce_mode ? clear : exec,
                                debounce_mode === undefined ? delay - elapsed : delay);
      }
    }

    if ($.guid) {
      wrapper.guid = callback.guid = callback.guid || $.guid++;
    }

    return wrapper;
  };

  $.debounce = function(delay, at_begin, callback) {
    return callback === undefined ?
      $.throttle(delay, at_begin, false) :
      $.throttle(delay, callback, at_begin !== false);
  };

})(this);
