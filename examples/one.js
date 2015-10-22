'use strict';

// This example uses Lab because that's the testing framework for the project.
// However, it could just as easily be any other framework

var Fs = require('fs');
var Code = require('code');
var StandIn = require('../');
var expect = Code.expect;

// Here we want to make sure the error part of the code is executed, so we intercept console.log
// and check the value
StandIn.replace(console, 'error', function (stand, value) {
  stand.restore();
  expect(value.code).to.equal('ENOENT');
  process.exit(0);
});

// We have replaced readFile with a function that always throw an error
StandIn.replace(Fs, 'readFile', function (stand, path, callback) {
  stand.restore();
  expect(path).to.equal('README.md');
  callback({
    code: 'ENOENT'
  });
});

var logger = {
  getLog: function () {
    Fs.readFile('README.md', function (error, data) {
      if (error) {
        console.error(error);
      } else {
        console.log(data + '');
      }
    });
  }
};

logger.getLog();
