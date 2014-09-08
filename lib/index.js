'use strict'
//Load modules
var Assert = require('assert');
var ObjHash = require('objhash');

// Declare internals
var internals = {
  db: {}
};

exports.replace = function (obj, method, fn) {

  var result = {};

  Assert.ok(obj, 'obj must be defined');
  Assert.strictEqual(typeof obj, 'object', 'obj must be an object');
  Assert.strictEqual(typeof obj[method], 'function', 'method must be a valid function of obj');
  Assert.strictEqual(typeof fn, 'function', 'fn must be a function object');

  var hash = ObjHash(obj) + method;

  Assert.equal(internals.db[hash], undefined, 'there is already a replace for "obj"[' + method + ']');
  internals.db[hash] = true;

  Object.defineProperty(result, 'original', {
    value: obj[method]
  });

  obj[method] = fn;

  Object.defineProperty(result, 'restore', {
    value: function() {
      
      delete internals.db[hash];
      obj[method] = this.original;
    }
  });

  return result;
};
