(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return new (factory(global, global.document))();
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = new (factory(global, global.document))();
  } else {
    global.Push = new (factory(global, global.document))();
  }
})(typeof window !== 'undefined' ? window : this, function (w, d) {
  var Push = function () {
    var
    self = this,
    isUndefined = function (obj) { return obj === undefined; },
    isString = function (obj) { return typeof obj === 'string'; },
    isFunction = function (obj) { return obj && {}.toString.call(obj) === '[object Function]'; },
    currentId = 0,
    incompatibilityErrorMessage = 'PushError: push.js is incompatible with browser.',
    notifications = {},
    lastWorkerPath = null,

    closeNotification = function (id) {
      var errored = false;
      var notification = notifications[id];

      if (typeof notification !== 'undefined') {
        if (notification.close) {
          notification.close();
        } else if (notification.cancel) {
          notification.cancel();
        } else if (w.external && w.external.msIsSiteMode) {
          w.external.msSiteModeClearIconOverlay();
        } else {
          errored = true;
          throw new Error('Unable to close notification: unknown interface');
        }

        if (!errored) return removeNotification(id);
      }

      return false;
    },

    addNotification = function (notification) {
      var id = currentId;

      notifications[id] = notification;
      currentId++;

      return id;
    },

    removeNotification = function (id) {
      var dict = {};
      var success = false;
      var key;

      for (key in notifications) {
        if (notifications.hasOwnProperty(key)) {
          if (key != id) {
            dict[key] = notifications[key];
          } else {
            success = true;
          }
        }
      }

      notifications = dict;

      return success;
    },

    prepareNotification = function (id, options) {
      var wrapper;

      wrapper = {
        get: function () {
          return notifications[id];
        },
        close: function () {
          closeNotification(id);
        }
      };

      if (options.timeout) {
        setTimeout(function () {
          wrapper.close();
        }, options.timeout);
      }

      return wrapper;
    },

    createCallback = function (title, options, resolve) {
      var notification;
      var onClose;

      options = options || {};

      self.lastWorkerPath = options.serviceWorker || 'serviceWorker.js';

      onClose = function (id) {
        removeNotification(id);

        if (isFunction(options.onClose)) {
          options.onClose.call(this, notification);
        }
      };

      if (w.Notification) {
        try {
          notification =  new w.Notification(title, {
            icon: (isString(options.icon) || isUndefined(options.icon)) ? options.icon : options.icon.x32,
            body: options.body,
            tag: options.tag,
            requireInteraction: options.requireInteraction,
            silent: options.silent
          });
        } catch (e) {
          if (w.navigator) {
            w.navigator.serviceWorker.register(self.lastWorkerPath);
            w.navigator.serviceWorker.ready.then(function (registration) {
              var localData = {
                id: currentId,
                link: options.link,
                origin: document.location.href,
                onClick: (isFunction(options.onClick)) ? options.onClick.toString() : '',
                onClose: (isFunction(options.onClose)) ? options.onClose.toString() : ''
              };

              if (typeof options.data !== 'undefined' && options.data !== null) {
                localData = Object.assign(localData, options.data);
              }

              registration.showNotification(title, {
                icon: options.icon,
                body: options.body,
                vibrate: options.vibrate,
                tag: options.tag,
                data: localData,
                requireInteraction: options.requireInteraction
              }).then(function() {
                var id;

                registration.getNotifications().then(function(notifications) {
                  id = addNotification(notifications[notifications.length - 1]);

                  registration.active.postMessage('');
                  navigator.serviceWorker.addEventListener('message', function (event) {
                    var data = JSON.parse(event.data);

                    if (data.action === 'close' && Number.isInteger(data.id)) removeNotification(data.id);
                  });

                  resolve(prepareNotification(id, options));
                });
              });
            });
          }
        }
      } else if (w.webkitNotifications) {
        notification = w.webkitNotifications.createNotification(
          options.icon,
          title,
          options.body
        );

        notification.show();
      } else if (navigator.mozNotification) {
        notification = navigator.mozNotification.createNotification(
            title,
            options.body,
            options.icon
        );

        notification.show();
      } else if (w.external && w.external.msIsSiteMode()) {
        w.external.msSiteModeClearIconOverlay();
        w.external.msSiteModeSetIconOverlay(
          ((isString(options.icon) || isUndefined(options.icon)) ? options.icon : options.icon.x16),
          title
        );
        w.external.msSiteModeActivate();

        notification = {};
      } else {
        throw new Error('Unable to create notification: unknown interface');
      }

      if (typeof(notification) !== 'undefined') {
        var id = addNotification(notification);
        var wrapper = prepareNotification(id, options);

        if (isFunction(options.onShow)) notification.addEventListener('show', options.onShow);
        if (isFunction(options.onError)) notification.addEventListener('error', options.onError);
        if (isFunction(options.onClick)) notification.addEventListener('click', options.onClick);

        notification.addEventListener('close', function() {
          onClose(id);
        });
        notification.addEventListener('cancel', function() {
          onClose(id);
        });

        resolve(wrapper);
      }

      resolve({});
    },

    Permission = {
      DEFAULT: 'default',
      GRANTED: 'granted',
      DENIED: 'denied'
    },

    Permissions = [Permission.GRANTED, Permission.DEFAULT, Permission.DENIED];

    self.Permission = Permission;

    self.Permission.request = function (onGranted, onDenied) {
      var existing = self.Permission.get();

      if (!self.isSupported) {
        throw new Error(incompatibilityErrorMessage);
      }

      callback = function (result) {
        switch (result) {
          case self.Permission.GRANTED:
            if (onGranted) onGranted();
            break;
          case self.Permission.DENIED:
            if (onDenied) onDenied();
            break;
          default:
            // Nothing
        }
      };

      if (existing !== self.Permission.DEFAULT) {
        callback(existing);
      } else if (w.Notification && w.Notification.requestPermission) {
        Notification.requestPermission(callback);
      } else if (w.webkitNotifications && w.webkitNotifications.checkPermission) {
        w.webkitNotifications.requestPermission(callback);
      } else {
        throw new Error(incompatibilityErrorMessage);
      }
    };

    self.Permission.has = function () {
      return Permission.get() === Permission.GRANTED;
    };

    self.Permission.get = function () {
      var permission;

      if (!self.isSupported) {
        throw new Error(incompatibilityErrorMessage);
      }

      if (w.Notification && w.Notification.permissionLevel) {
        permission = w.Notification.permissionLevel;
      } else if (w.webkitNotifications && w.webkitNotifications.checkPermission) {
        permission = Permissions[w.webkitNotifications.checkPermission()];
      } else if (w.Notification && w.Notification.permission) {
        permission = w.Notification.permission;
      } else if (navigator.mozNotification) {
        permission = Permission.GRANTED;
      } else if (w.external && w.external.msIsSiteMode() !== undefined) {
        permission = w.external.msIsSiteMode() ? Permission.GRANTED : Permission.DEFAULT;
      } else {
        throw new Error(incompatibilityErrorMessage);
      }

      return permission;
    };

    self.isSupported = (function () {
      var isSupported = false;

      try {
        isSupported = !!(w.Notification ||
          w.webkitNotifications ||
          navigator.mozNotification ||
          (w.external && w.external.msIsSiteMode() !== undefined));
      } catch (e) {
        // Nothing
      }

      return isSupported;
    })();

    self.create = function (title, options) {
      var promiseCallback;

      if (!self.isSupported) {
        throw new Error(incompatibilityErrorMessage);
      }

      if (!isString(title)) {
        throw new Error('PushError: Title of notification must be a string');
      }

      if (!self.Permission.has()) {
        promiseCallback = function(resolve, reject) {
          self.Permission.request(function() {
            try {
              createCallback(title, options, resolve);
            } catch (e) {
              reject(e);
            }
          }, function() {
            reject('Permission request declined');
          });
        };
      } else {
        promiseCallback = function(resolve, reject) {
          try {
            createCallback(title, options, resolve);
          } catch (e) {
            reject(e);
          }
        };
      }

      return new Promise(promiseCallback);
    };

    self.count = function () {
      var count = 0;
      var key;

      for (key in notifications) {
        count++;
      }

      return count;
    },

    self.__lastWorkerPath = function () {
      return self.lastWorkerPath;
    },

    self.close = function (tag) {
      var key;

      for (key in notifications) {
        notification = notifications[key];

        if (notification.tag === tag) return closeNotification(key);
      }
    },

    self.clear = function () {
      var success = true;
      var key;

      for (key in notifications) {
        success = success && closeNotification(key);
      }

      return success;
    };
  };

  return Push;
});
