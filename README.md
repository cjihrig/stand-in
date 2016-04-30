# stand-in
Method replacement and testing utility

[![Build Status](https://travis-ci.org/continuationlabs/stand-in.svg?branch=master)](https://travis-ci.org/continuationlabs/stand-in)
[![npm version](https://img.shields.io/npm/v/stand-in.svg)](https://www.npmjs.org/package/stand-in)
[![Dependencies](https://img.shields.io/david/continuationlabs/stand-in.svg)](https://github.com/continuationlabs/stand-in)

[![belly-button-style](https://cdn.rawgit.com/continuationlabs/belly-button/master/badge.svg)](https://github.com/continuationlabs/belly-button)

## Description

Often when unit testing, it is helpful to capture or replace function calls with testing code. `stand-in` provides a quick and easy way to replace object methods with your own. It also provides a method to restore the original method after testing is complete.

## Usage

```javascript
var standin = require('stand-in');
var assert = require('assert');
var log = standin.replace(console, 'log', function (stand, value) {
  assert.strictEqual(value, 'test data', 'value should equal test data');
  stand.restore();
});

console.log('test data');
```

- `replace(obj, path, fn [, options])` - replaces `obj[path]` with `fn` where:
  - `obj` - object that has the method to replace. Will be used at `this` pointer inside `fn`.
  - `path` - string path to the function to replace. Supports deep paths via "foo.bar.baz".
  - `fn` - function to replace `obj[method]` with. The first argument to this function will be a stand-in object. This is helpful if you don't want to create a holding variable.
  - `options` - an optional object supporting the following properties.
    - `startOn` - the invocation number to begin using the replacement function. Defaults to `0`.
    - `stopAfter` - the final invocation number to use the replacement function. Once this number is reached, the `stand-in` object will `restore()` itself. Defaults to `Infinity`.

Returns a `stand-in` object:
  - `restore()` - restores the original `obj[method]` to the previous function. Generally, this will restore the method back to the initial value.
  - `original` - a handle to the original method in case you need to conditionally call it.
  - `invocations` - the number of times the `stand-in` has been called.

## Note

`replace` tries to prevent users from completely losing a handle to the original method. For example, you will receive an `AssertionError` if you try to replace `console.log` twice without first `restore`ing the function first.
