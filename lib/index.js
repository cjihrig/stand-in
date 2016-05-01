'use strict';
// Load modules
const Assert = require('assert');
const Get = require('lodash.get');
const Set = require('lodash.set');
const STORE = [];

STORE.lookUp = function (obj, path) {
  let i = this.length;
  let lookup;
  while (!lookup && i--) {
    const item = this[i];

    if (item.obj === obj && item.path === path) {
      lookup = item;
    }
  }
  return {
    result: lookup,
    index: i
  };
};

module.exports.replace = function (obj, path, fn, options) {
  Assert.ok(obj, 'obj must be defined');
  Assert.ok(typeof obj === 'object' || typeof obj === 'function', 'obj must be an object or a constructor');
  const func = Get(obj, path);
  Assert.strictEqual(typeof func, 'function', 'path must be a valid function of obj');
  Assert.strictEqual(typeof fn, 'function', 'fn must be a function object');

  const find = STORE.lookUp(obj, path);
  Assert.strictEqual(find.result, undefined, 'there is already a replace for "obj"[' + path + ']');

  options = Object.assign({}, options);

  const startOn = options.startOn | 0; // Force to an integer
  let invocations = 0;
  const stand = {
    obj: obj,
    path: path
  };
  STORE.push(stand);

  function restore () {
    const find = STORE.lookUp(obj, path);
    STORE.splice(find.index, 1);
    Set(obj, path, func);
  }

  function wrapper () {
    invocations++;

    if (invocations < startOn) {
      return func.apply(this, arguments);
    }

    if (invocations === options.stopAfter) {
      result.restore();
    }

    const args = new Array(arguments.length + 1);
    args[0] = result;

    for (let i = 0; i < arguments.length; ++i) {
      args[i + 1] = arguments[i];
    }

    return fn.apply(this, args);
  }

  const result = {
    original: func,
    restore,
    get invocations () { return invocations; },
    _stand: stand
  };

  Set(obj, path, wrapper);
  return result;
};
