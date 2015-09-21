'use strict';
// Load modules
var Assert = require('assert');

// Declare internals
var internals = {
  store: []
};

internals.store.lookUp = function (obj, method) {
  var i = this.length;
  var lookup;
  while (i-- && !lookup) {
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
  Assert.strictEqual(typeof obj[method], 'function', 'method must be a valid function of obj');
  Assert.strictEqual(typeof fn, 'function', 'fn must be a function object');

  var stand = {
    obj: obj,
    method: method
  };
  var find = internals.store.lookUp(obj, method);
  Assert.strictEqual(find.result, undefined, 'there is already a replace for "obj"[' + method + ']');
  internals.store.push(stand);

  var result = {
    original: obj[method].bind(obj),
    restore: function () {
      var find = internals.store.lookUp(this._stand.obj, this._stand.method);
      internals.store.splice(find.index, 1);
    },
    _stand: stand
  };

  obj[method] = fn.bind(obj, result);
  return result;
};
