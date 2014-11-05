/*
 * TestSuite
 */
GLOBAL.CONFIG = require('./../config.js');

// nodeServer4334 = require("./../misc/myTestSampleServer.js").newOpcuaServer(4321);

var async = require('async');
// var opc = require('./../models/simpleOpcua').server('opc.tcp://localhost:4334/');
var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.175.230:4840/');
var opcH = require('./../models/simpleOpcuaHelper');

opc.initialize(function(err) {
  if (err) {
    console.log(err);
    return 0;
  }

  console.log('initialized');

  // opc.mi5Subscribe();
  // var mon = opc.mi5Monitor('MI5.Queue.Queue0.UserParameter.UserParameter0.Value');
  // mon.on("changed", function(data) {
  // console.log('CHANGED', data);
  // });

  async.series([ function(callback) {
    callback();
  },

  // function(callback) {
  // testArray = [ 'MI5.Recipe[0].Name' ];
  // opc.mi5ReadArray(testArray, function(err, data) {
  // console.log(data);
  // callback(err);
  // });
  // },

  function(callback) {
    var recipe = opc._structRecipeBase('MI5.Recipe[0].');
    opc.mi5ReadArray(recipe, function(err, data) {
      // console.log(data);

      /**
       * Create Jade-Compatible Array
       * 
       * @param data
       *          <array> (e.g. [{nodeId: ..., value: ..., sub...},{},{}]
       * @return
       */
      function _convertMi5ReadArrayToJade(data) {
        var recipe = new Array;
        data.forEach(function(item) {
          var nodeElements = opcH.splitNodeId(item.nodeId);
          console.log(nodeElements);
          // For Recipe-layer
          if (nodeElements.length == 3) {
            var last = _.last(nodeElements);
            if (!opcH.detectIfArray(last)) {
              var temp = {};
              temp[last] = item;
              recipe.push(temp);
            }
          }
        });
        var userParameter = new Array;
        var parameter = 0;
        data.forEach(function(item) {
          var nodeElements = opcH.splitNodeId(item.nodeId);
          console.log(nodeElements);
          // For UserParameterLayer
          if (nodeElements.length == 4) {
            var last = _.last(nodeElements);
            nodeElements.pop();
            var secondlast = _.last(nodeElements);
            if (!opcH.detectIfArray(last)) {
              var temp = {};
              temp[last] = item;
              userParameter.push(temp);
            }

          }
        });

        return recipe;
      }

      var output = _convertMi5ReadArrayToJade(data);
      console.log(output);
      callback(err);
    })
    // console.log(structRecipeBase('MI5.Recipe[0].'));
  }

  // function(callback) {
  // console.log('1');
  // testArray = [ 'MI5.Queue.Queue0.UserParameter.UserParameter0.Value',
  // 'MI5.Queue.Queue0.UserParameter.UserParameter1.Value' ];
  // opc.mi5ReadArray(testArray, function(err, data) {
  // console.log(err, data);
  // callback();
  // });
  //
  // },
  // function(callback) {
  // console.log('2');
  // testObject = {
  // UserParameter : [ {
  // Value : 30
  // }, {
  // Value : 10
  // } ]
  // };
  // opc.mi5WriteObject('MI5.Queue.Queue0', testObject, function(err) {
  // console.log(err);
  // callback();
  // });
  // },
  // function(callback) {
  // console.log('3');
  // testArray = [ 'MI5.Queue.Queue0.UserParameter.UserParameter0.Value',
  // 'MI5.Queue.Queue0.UserParameter.UserParameter1.Value' ];
  // opc.mi5ReadArray(testArray, function(err, data) {
  // console.log(err, data);
  // callback();
  // });

  // }
  ], function(err) {
    opc.disconnect(function() {
    });
    // setTimeout(function() {
    // console.log('----Terminated');
    // process.exit(0);
    // }, 1000);
    // });
  });

});