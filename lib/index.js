'use strict';
// Load modules
var Assert = require('assert');
var Get = require('lodash.get');
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

exports.replace = function (obj, path, fn) {
  Assert.ok(obj, 'obj must be defined');
  Assert.ok(typeof obj === 'object' || typeof obj === 'function', 'obj must be an object or a constructor');
  var func = Get(obj, path);
  Assert.strictEqual(typeof func, 'function', 'path must be a valid function of obj');
  Assert.strictEqual(typeof fn, 'function', 'fn must be a function object');

  var stand = {
    obj: obj,
    path: path
  };
  var find = internals.store.lookUp(obj, path);
  Assert.strictEqual(find.result, undefined, 'there is already a replace for "obj"[' + path + ']');
  internals.store.push(stand);

  var result = {
    original: func.bind(obj),
    restore: function () {
      var find = internals.store.lookUp(obj, path);
      internals.store.splice(find.index, 1);
      Set(obj, path, this.original);
    },
    _stand: stand
  };

  Set(obj, path, fn.bind(obj, result));
  return result;
};
