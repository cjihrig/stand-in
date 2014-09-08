//Load modules

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var standin = require('../');

// Declare test aliases
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Lab.expect;

describe('stand-in', function () {

  describe('replace', function () {

    it('replaces a defined method', function (done) {

      var log = standin.replace(console, 'log', function (value) {

        expect(value).to.equal('test');
        log.restore();
        done();
      });

      console.log('test');
    });

    it('correctly restores a replaced method', function (done) {

      var foo = {
        bar: function (valueone, valuetwo) {
          console.log('%s,%s');
        }
      }

      var replace = standin.replace(foo, 'bar', function (valueone, valuetwo) {

        expect(valueone).to.equal(1);
        expect(valuetwo).to.equal(2);

        replace.restore();

        expect(foo.bar).to.deep.equal(foo.bar);
        done();

      });

      foo.bar(1,2);

    });
  });

  describe('assertions', function () {

    it('throws an error if obj is not defined', function (done) {

      expect(function() {

        standin.replace(null)
      }).to.throw('obj must be defined');

      done();
    });

    it('throws an error if obj is not an object', function (done) {

      expect(function() {

        standin.replace(1)
      }).to.throw('obj must be an object');

      done();
    });

    it('throws an error if obj[function] is undefined', function (done) {

      expect(function() {

        standin.replace(console, 'foo');
      }).to.throw('method must be a valid function of obj');


      done();
    });

    it('throws an error if obj[function] is not a function', function (done) {
      var foo = {
        bar: 1
      };

      expect(function() {

        standin.replace(foo, 'bar');
      }).to.throw('method must be a valid function of obj');

      done();
    });

    it('throws an error if fn is not a function', function (done) {
      var foo = {
        bar: function() {}
      };

      expect(function() {

        standin.replace(foo, 'bar', 1);
      }).to.throw('fn must be a function object');

      done();
    });

  });

  describe('duplication', function () {

    it('throws an error if you try to replace without restoring on the same object', function (done) {

      var log = standin.replace(console, 'log', function (value) {});

      expect(function () {
        var log2 = standin.replace(console, 'log', function (value) {});
      }).to.throw('there is already a replace for "obj"[log]');

      log.restore();

      done();

    });

    it('allows duplication methods if obj is a new instance', function (done) {

      for (var i = 0; i < 10; ++i) {
        var x = {};
        x.foo = function (value) {
          console.log(value);
        }
        var foo = standin.replace(x, 'foo', function (value) {

          expect(value).to.equal(i);
          foo.restore();
        });
        x.foo(i);
      }

      done();
    });

  });
});
