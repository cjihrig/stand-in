# stand-in
Method replacement and testing utility

[![build status](https://travis-ci.org/arb/stand-in.svg?branch=master)](https://travis-ci.org/arb/stand-in) | 
[![npm version](https://img.shields.io/npm/v/stand-in.svg)](https://www.npmjs.org/package/stand-in)

## Description

Often when unit testing, it is helpful to capture or replace function calls with testing code. `stand-in` provides a quick and easy way to replace object methods with your own. It also provides a method to restore the original method after testing is complete.

## Usage

```javascript
var standin = require('stand-in');
var assert = require('assert');
var log = standin.replace(console, 'log', function (stand, value) {

  assert.strictEqual(value, 'test data', 'value should equal test data');
  log.restore();
});

console.log('test data');
```

- `replace(obj, method, fn)` - replaces `obj[method]` with `fn` where:
  - `obj` - object that has the method to replace. Will be used at `this` pointer inside `fn`.
  - `method` - string name of the function to replace.
  - `fn` - function to replace `obj[method]` with. The first argument to this function will be a stand-in object. This is helpful if you don't want to create a holding variable.

Returns a `stand-in` object:
  - `restore()` - restores the original `obj[method]` to the previous function. Generally, this will restore the method back to the initial value.
  - `original` - a handle to the original method in case you need to conditionally call it.

## Note

`replace` tries to prevent users from completely losing a handle to the original method. For example, you will receive an `AssertionError` if you try to replace `console.log` twice without first `restore`ing the function first.

## License

Copyright (c) 2014 Adam Bretz

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
