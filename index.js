/* global goinstant, require, module */

'use strict';

var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN;
var util = require('util');
var _ = require('lodash');
var isBuffer = require('isbuffer');

//var Iterator = require('./iterator');

window.levelup = require('levelup');
window.GoDown = module.exports = GoDown;

var NAMESPACE = 'GODOWN';

GoDown.NAMESPACE = NAMESPACE;

function GoDown (location) {
  if (!(this instanceof GoDown)) return new GoDown(location);
  if (!location) throw new Error('constructor requires at least a location argument');
  if (!window.goinstant) throw new Error('GoDown requires GoInstant');

  location = location.split('/');

  this.room = _.last(location);
  this.location = _.initial(location, 1).join('/');
}

util.inherits(GoDown, AbstractLevelDOWN);

GoDown.prototype._open = function (options, callback) {
  var self = this;
  var opts = { room: this.room };

  goinstant.connect(this.location, opts, function(err, conn, room) {
    if (err) return callback(err);

    self.goinstant = room.key(NAMESPACE);
    callback(null, conn);
  });
};

GoDown.prototype._close = function (callback) {
  goinstant.disconnect(callback);
};

GoDown.prototype._get = function (key, options, callback) {
  this.goinstant.key(key).get(function(err, value) {
    if (err) {
      return callback(err);
    }

    if (_.isNull(value)) {
      return callback(new Error('NotFound'));
    }

    if (options.asBuffer !== false  && !isBuffer(value)) {
      value = stringToArrayBuffer(String(value));
      return callback(null, value, key);
    }

    callback(null, value, key);
  });
};

GoDown.prototype._del = function(key, options, callback) {
  this.goinstant.key(key).remove(callback);
};

GoDown.prototype._put = function (key, value, options, callback) {
  // do something with options

  this.goinstant.key(key).set(value, callback);
};

GoDown.prototype._isBuffer = isBuffer;

GoDown.prototype._checkKeyValue = function (obj, type) {
  if (obj === null || obj === undefined) {
    return new Error(type + ' cannot be `null` or `undefined`');
  }

  if (obj === null || obj === undefined) {
    return new Error(type + ' cannot be `null` or `undefined`');
  }

  if (isBuffer(obj) && obj.byteLength === 0) {
    return new Error(type + ' cannot be an empty ArrayBuffer');
  }

  if (String(obj) === '') {
    return new Error(type + ' cannot be an empty String');
  }

  if (obj.length === 0) {
    return new Error(type + ' cannot be an empty Array');
  }
}

function ArrayBufferToString(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function stringToArrayBuffer(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
}


