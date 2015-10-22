'use strict';
// Load modules

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var StandIn = require('../');

// Declare test aliases
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('stand-in', function () {
  describe('replace', function () {
    it('replaces a defined method', function (done) {
      var log = StandIn.replace(console, 'log', function (stand, value) {
        expect(value).to.equal('test');
        log.restore();
        done();
      });

      console.log('test');
    });

    it('correctly restores a replaced method', function (done) {
      var foo = {
        bar: function (valueone, valuetwo) {
          throw new Error('this is a test error');
        }
      };

      var replace = StandIn.replace(foo, 'bar', function (stand, valueone, valuetwo) {
        expect(valueone).to.equal(1);
        expect(valuetwo).to.equal(2);

        replace.restore();

        expect(foo.bar).to.throw(Error, 'this is a test error');
        done();
      });

      foo.bar(1, 2);
    });

    it('uses the correct this context', function (done) {
      var foo = {
        value: 55,
        bar: function (valueone, valuetwo) {
          console.log('%s,%s');
        }
      };

      var replace = StandIn.replace(foo, 'bar', function (stand, valueone, valuetwo) {
        expect(valueone).to.equal(1);
        expect(valuetwo).to.equal(2);
        expect(this.value).to.equal(55);

        replace.restore();

        expect(foo.bar).to.deep.equal(foo.bar);
        done();
      });

      foo.bar(1, 2);
    });

    it('provides a mechanism to use the original method', function (done) {
      var foo = {
        bar: function () {
          return false;
        }
      };

      var replace = StandIn.replace(foo, 'bar', function () {
        expect(replace.original()).to.equal(false);
        replace.restore();
        done();
      });

      foo.bar(1);
    });

    it('provides the stand-in object as the first parameter to the function', function (done) {
      var log = StandIn.replace(console, 'log', function (stand, value) {
        expect(value).to.equal('test');
        expect(stand).to.deep.equal(log);

        stand.restore();
        done();
      });

      console.log('test');
    });

    it('supports deep paths for replace', function (done) {
      var x = {
        foo: {
          bar: {
            baz: function (value) {
              throw new Error('you are inside baz.');
            }
          }
        }
      };

      StandIn.replace(x, 'foo.bar.baz', function (stand, value) {
        stand.restore();
        expect(value).to.be.true();
        expect(x.foo.bar.baz).to.throw(Error, 'you are inside baz.');
        done();
      });
      x.foo.bar.baz(true);
    });
  });

  describe('assertions', function () {
    it('throws an error if obj is not defined', function (done) {
      expect(function () {
        StandIn.replace(null);
      }).to.throw('obj must be defined');

      done();
    });

    it('throws an error if obj is not an object', function (done) {
      expect(function () {
        StandIn.replace(1);
      }).to.throw('obj must be an object');

      done();
    });

    it('throws an error if obj[function] is undefined', function (done) {
      expect(function () {
        StandIn.replace(console, 'foo');
      }).to.throw('method must be a valid function of obj');

      done();
    });

    it('throws an error if obj[function] is not a function', function (done) {
      var foo = {
        bar: 1
      };

      expect(function () {
        StandIn.replace(foo, 'bar');
      }).to.throw('method must be a valid function of obj');

      done();
    });

    it('throws an error if fn is not a function', function (done) {
      var foo = {
        bar: function () {}
      };

      expect(function () {
        StandIn.replace(foo, 'bar', 1);
      }).to.throw('fn must be a function object');

      done();
    });
  });

  describe('duplication', function () {
    it('throws an error if you try to replace without restoring on the same object', function (done) {
      var log = StandIn.replace(console, 'log', function (value) {});

      expect(function () {
        StandIn.replace(console, 'log', function (value) {});
      }).to.throw('there is already a replace for "obj"[log]');

      log.restore();

      done();
    });

    it('allows duplication methods if obj is a new instance', function (done) {
      var bar = function (value) {
        console.log(value);
      };
      var error = StandIn.replace(console, 'error', function (stand, value) {});

      for (var i = 0; i < 10; ++i) {
        var x = {};
        x.bar = bar;
        x.value = i;

        StandIn.replace(x, 'bar', function (stand, value) {
          expect(value).to.equal(i);
          expect(this.value).to.equal(i);
          stand.restore();
        });
        x.bar(i);
      }

      error.restore();
      done();
    });

    it('allows multiple methods to be replaced on a single instance', function (done) {
      StandIn.replace(console, 'log', function (stand, value) {
        expect(value).to.equal('foo');
        stand.restore();
      });
      StandIn.replace(console, 'error', function (stand, value) {
        expect(value).to.equal('bar');
        stand.restore();
      });

      console.log('foo');
      console.error('bar');
      done();
    });
  });
});
