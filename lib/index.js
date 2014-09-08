'use strict'
//Load modules
var Assert = require('assert');
var ObjHash = require('objhash');

// Declare internals
var internals = {
  db: {}
};

exports.replace = function (obj, method, fn) {

  Assert.ok(obj, 'obj must be defined');
  Assert.strictEqual(typeof obj, 'object', 'obj must be an object');
  Assert.strictEqual(typeof obj[method], 'function', 'method must be a valid function of obj');
  Assert.strictEqual(typeof fn, 'function', 'fn must be a function object');

  var hash = ObjHash(obj) + method;

  Assert.equal(internals.db[hash], undefined, 'there is already a replace for "obj"[' + method + ']');

  internals.db[hash] = true;

  var orig = obj[method];
  obj[method] = fn;

  var _restore = function () {

    delete internals.db[hash];
    obj[method] = orig;
  };

  return {
    restore: _restore
  }

};
