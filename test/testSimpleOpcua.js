/*
 * TestSuite
 */
GLOBAL.CONFIG = require('./../config.js');

// nodeServer4334 = require("./../misc/myTestSampleServer.js").newOpcuaServer(4321);

var async = require('async');
var opc = require('./../models/simpleOpcua').server('opc.tcp://localhost:4334/');

opc.initialize(function() {

  console.log('initialized');

  opc.mi5Subscribe();
  var mon = opc.mi5Monitor('MI5.Queue.Queue0.UserParameter.UserParameter0.Value');
  mon.on("changed", function(data) {
    console.log('CHANGED', data);
  });

  async.series([
      function(callback) {
        callback();
      },

      function(callback) {
        console.log('1');
        testArray = [ 'MI5.Queue.Queue0.UserParameter.UserParameter0.Value',
            'MI5.Queue.Queue0.UserParameter.UserParameter1.Value' ];
        opc.mi5ReadArray(testArray, function(err, data) {
          console.log(err, data);
          callback();
        });

      },
      function(callback) {
        console.log('2');
        testObject = {
          UserParameter : [ {
            Value : 30
          }, {
            Value : 10
          } ]
        };
        opc.mi5WriteObject('MI5.Queue.Queue0', testObject, function(err) {
          console.log(err);
          callback();
        });
      },
      function(callback) {
        console.log('3');
        testArray = [ 'MI5.Queue.Queue0.UserParameter.UserParameter0.Value',
            'MI5.Queue.Queue0.UserParameter.UserParameter1.Value' ];
        opc.mi5ReadArray(testArray, function(err, data) {
          console.log(err, data);
          callback();
        });

      } ], function() {
    // opc.disconnect(function() {
    // setTimeout(function() {
    // console.log('----Terminated');
    // process.exit(0);
    // }, 1000);
    // });
  });

});