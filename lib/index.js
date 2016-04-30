'use strict';
// Load modules
var Assert = require('assert');
var Get = require('lodash.get');
var Merge = require('lodash.merge');
var Set = require('lodash.set');

// Declare internals
var internals = {
  store: []
};

internals.store.lookUp = function (obj, path) {
  var i = this.length;
  var lookup;
  while (!lookup && i--) {
    var item = this[i];

    if (item.obj === obj && item.path === path) {
      lookup = item;
    }
  }
  return {
    result: lookup,
    index: i
  };
};

exports.replace = function (obj, path, fn, options) {
  Assert.ok(obj, 'obj must be defined');
  Assert.ok(typeof obj === 'object' || typeof obj === 'function', 'obj must be an object or a constructor');
  var func = Get(obj, path);
  Assert.strictEqual(typeof func, 'function', 'path must be a valid function of obj');
  Assert.strictEqual(typeof fn, 'function', 'fn must be a function object');

  var find = internals.store.lookUp(obj, path);
  Assert.strictEqual(find.result, undefined, 'there is already a replace for "obj"[' + path + ']');

  options = Merge({}, options);

  var startOn = options.startOn | 0; // Force to an integer
  var invocations = 0;
  var stand = {
    obj: obj,
    path: path
  };
  internals.store.push(stand);

  function restore () {
    var find = internals.store.lookUp(obj, path);
    internals.store.splice(find.index, 1);
    Set(obj, path, this.original);
  }

  var result = {
    original: func,
    restore: restore,
    get invocations () { return invocations; },
    _stand: stand
  };

  function wrapper () {
    invocations++;

    if (invocations < startOn) {
      return func.apply(this, args);
    }

    if (invocations === options.stopAfter) {
      result.restore();
    }

    var args = new Array(arguments.length + 1);

    args[0] = result;

    for (var i = 0; i < arguments.length; ++i) {
      args[i + 1] = arguments[i];
    }

    return fn.apply(this, args);
  }

  Set(obj, path, wrapper);
  return result;
};
