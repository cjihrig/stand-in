'use strict';
// Load modules
var Assert = require('assert');
var ObjectPath = require('object-path');

// Declare internals
var internals = {
  store: []
};

internals.store.lookUp = function (obj, method) {
  var i = this.length;
  var lookup;
  while (!lookup && i--) {
    var item = this[i];

    if (item.obj === obj && item.method === method) {
      lookup = item;
    }
  }
  return {
    result: lookup,
    index: i
  };
};

exports.replace = function (obj, method, fn) {
  Assert.ok(obj, 'obj must be defined');
  Assert.strictEqual(typeof obj, 'object', 'obj must be an object');
  var func = ObjectPath.get(obj, method);
  Assert.strictEqual(typeof func, 'function', 'method must be a valid function of obj');
  Assert.strictEqual(typeof fn, 'function', 'fn must be a function object');

  var stand = {
    obj: obj,
    method: method
  };
  var find = internals.store.lookUp(obj, method);
  Assert.strictEqual(find.result, undefined, 'there is already a replace for "obj"[' + method + ']');
  internals.store.push(stand);

  var result = {
    original: func.bind(obj),
    restore: function () {
      var find = internals.store.lookUp(obj, method);
      internals.store.splice(find.index, 1);
      ObjectPath.set(obj, method, this.original);
    },
    _stand: stand
  };

  ObjectPath.set(obj, method, fn.bind(obj, result));
  return result;
};
