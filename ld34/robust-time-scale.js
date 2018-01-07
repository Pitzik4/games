(function(global) {
  'use strict';
  
  var oldNow, oldNowTarget;
  
  if(typeof performance === 'undefined') {
    oldNow = Date.now;
    oldNowTarget = Date;
  } else {
    oldNow = performance.now;
    oldNowTarget = performance;
    performance.now = function now() { return getCurrentTime(); };
  }
  Date.now = function now() { return getCurrentTime() |0; };
  
  function performanceNow() {
    return oldNow.call(oldNowTarget);
  }
  
  var scale = 1, add = 0;
  
  function getCurrentTime() {
    return performanceNow() * scale + add;
  }
  
  if(typeof requestAnimationFrame !== 'undefined') {
    var _requestAnimationFrame = global.requestAnimationFrame;
    global.requestAnimationFrame = function requestAnimationFrame(callback) {
      return _requestAnimationFrame(function() {
        callback(getCurrentTime());
      });
    };
  }
  
  var activeTimeouts = {};
  
  function makeTimeoutFunc(_setTimeout, type) {
    return function setTimeout(callback) {
      var args = Array(arguments.length);
      for(var i = 0; i < arguments.length; ++i) {
        args[i] = arguments[i];
      }
      
      var intendedCallback = arguments[0];
      if(typeof intendedCallback !== 'function') {
        intendedCallback = String(intendedCallback);
        intendedCallback = new Function(intendedCallback);
      }
      var patchedCallback = function() {
        intendedCallback.apply(this, arguments);
        if(type === 'interval') {
          timeout.timeWhenSet += intendedInterval;
        } else {
          delete activeTimeouts[timeoutId];
        }
      };
      args[0] = patchedCallback;
      
      var intendedInterval = +arguments[1];
      if(intendedInterval !== intendedInterval || intendedInterval < 0) {
        intendedInterval = 0;
      }
      args[1] = intendedInterval / scale;
      
      var timeoutId = _setTimeout.apply(this, args);
      var timeout = {
        timeoutId: timeoutId,
        intendedCallback: intendedCallback,
        patchedCallback: patchedCallback,
        intendedInterval: intendedInterval,
        args: args,
        timeWhenSet: getCurrentTime(),
        type: type
      };
      activeTimeouts[timeoutId] = timeout;
      return timeoutId;
    };
  }
  
  var _setTimeout = global.setTimeout;
  global.setTimeout = makeTimeoutFunc(_setTimeout, 'timeout');
  
  var _setInterval = global.setInterval;
  var setIntervalImpl = makeTimeoutFunc(_setInterval, 'interval');
  global.setInterval = function setInterval(callback) {
    return setIntervalImpl.apply(this, arguments);
  };
  
  var _clearTimeout = global.clearTimeout;
  function clearTimeoutImpl(timeoutId) {
    if(Object.prototype.hasOwnProperty.call(activeTimeouts, timeoutId)) {
      _clearTimeout(activeTimeouts[timeoutId].timeoutId);
      delete activeTimeouts[timeoutId];
    } else {
      _clearTimeout(timeoutId);
    }
  }
  
  global.clearTimeout = function clearTimeout(timeoutId) {
    return clearTimeoutImpl(timeoutId);
  };
  global.clearInterval = function clearInterval(timeoutId) {
    return clearTimeoutImpl(timeoutId);
  };
  
  global.setTimeScale = function setTimeScale(ts) {
    var current = getCurrentTime();
    scale = ts;
    add = current - performanceNow() * scale;
    
    for(var timeoutIdKey in activeTimeouts) {
      if(!Object.prototype.hasOwnProperty.call(activeTimeouts, timeoutIdKey)) {
        continue;
      }
      
      (function(timeoutIdKey) {
        var timeout = activeTimeouts[timeoutIdKey];
        var timeoutId = +timeoutIdKey;
        
        var _timeoutId = timeout.timeoutId;
        var intendedCallback = timeout.intendedCallback;
        var patchedCallback = timeout.patchedCallback;
        var intendedInterval = timeout.intendedInterval;
        var args = timeout.args;
        var timeWhenSet = timeout.timeWhenSet;
        var type = timeout.type;
        
        _clearTimeout(_timeoutId);
        
        if(type === 'interval') {
          args[0] = function() {
            patchedCallback.apply(this, arguments);
            if(Object.prototype.hasOwnProperty.call(activeTimeouts, timeoutIdKey)) {
              // interval wasn't cancelled
              args[0] = patchedCallback;
              args[1] = intendedInterval / scale;
              var new_timeoutId = _setInterval.apply(this, args);
              timeout.timeoutId = new_timeoutId;
            }
          };
        } else {
          args[0] = patchedCallback;
        }
        
        args[1] = (timeWhenSet + intendedInterval - current) / scale;
        
        var new_timeoutId = _setTimeout.apply(this, args);
        timeout.timeoutId = new_timeoutId;
        
        args[0] = patchedCallback;
      })(timeoutIdKey);
    }
  };
})(window);
