# stand-in
Method replacement and testing utility
[![Build Status](https://travis-ci.org/arb/stand-in.svg?branch=master)](https://travis-ci.org/arb/stand-in)

## Description

Often when unit testing, it is helpful to capture or replace function calls with testing code. `stand-in` provides a quick and easy way to replace object methods with your own. It also provides a method to restore the original method after testing is complete.

## Usage

```javascript
var standin = require('stand-in');
var assert = require('assert');
var log = standin.replace(console, 'log', function (value) {

  assert.strictEqual(value, 'test data', 'value should equal test data');
  log.restore();
});

console.log('test data');
```

- `replace(obj, method, fn)` - replaces `obj[method]` with `fn`.
- `restore` - restores the original `obj[method]` to the previous function. Generally, this will restore the method back to the initial value.

## Note

`replace` tries to prevent users from completely losing a handle to the original method. For example, you will receive an `AssertionError` if you try to replace `console.log` twice without first `restore`ing the function first.
