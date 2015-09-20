'use strict';
// Load modules
var Assert = require('assert');

// Declare internals
var internals = {
  store: []
};

exports.replace = function (obj, method, fn) {
  Assert.ok(obj, 'obj must be defined');
  Assert.strictEqual(typeof obj, 'object', 'obj must be an object');
  Assert.strictEqual(typeof obj[method], 'function', 'method must be a valid function of obj');
  Assert.strictEqual(typeof fn, 'function', 'fn must be a function object');

  var stand = {
    obj: obj,
    method: method
  };

  var i = internals.store.length;
  var lookup;
  while (i-- && !lookup) {
    var item = internals.store[i];

    if (item.obj === obj && item.method === method) {
      lookup = item;
    }
  }

  Assert.equal(lookup, undefined, 'there is already a replace for "obj"[' + method + ']');
  internals.store.push(stand);

  var result = {
    original: obj[method].bind(obj),
    restore: function () {
      var i = internals.store.length;
      var lookup;
      while (i-- && !lookup) {
        var item = internals.store[i];

        if (item.obj === this._stand.obj && item.method === this._stand.method) {
          lookup = item;
        }
      }
      internals.store.splice(i, 1);
    },
    _stand: stand
  };

  obj[method] = fn.bind(obj, result);
  return result;
};
