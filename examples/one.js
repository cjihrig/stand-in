// This example uses Lab because that's the testing framework for the project.
// However, it could just as easily be any other framework

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var StandIn = require('../');
var Fs = require('fs');

// Declare test aliases
var describe = lab.describe;
var it = lab.it;
var expect = Lab.expect;

describe('test one', function() {

  it('logs an error opening a file', function (done) {

    // Here we want to make sure the error part of the code is executed, so we intercept console.log
    // and check the value
    var error = StandIn.replace(console, 'error', function (value) {

      error.restore();
      expect(value.code).to.equal('ENOENT');
      done();
    });

    // We have replaced readFile with a function that always throw an error
    var readFile = StandIn.replace(Fs, 'readFile', function (path, callback) {

      readFile.restore();
      expect(path).to.equal('README.md');
      callback({
        code: 'ENOENT'
      });
    });

    var logger = {
      getLog: function() {

        Fs.readFile('README.md', function (error, data) {

          if (error) {
            console.error(error);
          }
          else {
            console.log(data+'');
          }
        });
      }
    }

    logger.getLog();
  });
});
