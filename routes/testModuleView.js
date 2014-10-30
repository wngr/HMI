/*
 * Models
 * 
 * Strange: Sometimes it works, sometimes not.
 * Somehow it has to do with IO connection and socket I think.
 */
var globalI = 0;
console.log('testModuleView.js / root');

// console.log(_.uniqueId(myNodeId));
exports.index = function(req, res) {
  var opcuaInstance = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');
  jadeData = {};

  IO.on('connection', function(socket) {

    // SystemTime
    setInterval(function() {
      socket.emit('hmiSystemTime', Date().toString());
    }, 1000);

    // Disconnect
    socket.on('disconnect', function() {
      console.log('user disconnected');
      opcuaInstance.disconnect();
    });

    // Check how many sockets
    socket.on('mytest', function(bla) {
      console.log('mytest:', bla, globalI);
    });

  });

  /*
   * ReadArray
   */
  opcuaInstance.on('readArrayFinished', function(data) {
    function first(callback) {
      console.log('first');
      /*
       * Format the nodeValueArray to SkillContainer
       */
      var moduleData = {
        moduleData : {
          name : 'Halloho',
          skills : [ opcuaInstance.formatNodeValueArrayToSkillContainerArray(data) ]
        }
      };
      jadeData = _.extend(jadeData, moduleData);
      callback(null);
    }

    function second(callback) {
      console.log('second');
      /*
       * When the array is read, subscribe to all the nodes, that belong to that skill!
       */
      opcuaInstance.subscribe();
      data.forEach(function(entry) {
        var myNode = opcuaInstance.monitor('ns=4;s=' + entry.nodeId);
        myNode.on("changed", function(data) {
          console.log('changed:', entry.nodeId, data);
          // socket.emit(entry.updateEvent, entry.value); // not tested yet
        });

        console.log('added monitord item on:', entry.nodeId);
      });
      callback(null);
    }

    function third(callback) {
      console.log('third');
      console.log('render');
      console.log(JSON.stringify(jadeData, null, 1));
      res.render('bootstrap/testModuleView', jadeData);
      console.log('after render');
    }

    async.series([ first, second, third ]);
  });

  opcuaInstance.on('ready', function() {
    opcuaInstance.readArray(opcuaInstance.nodeArraySkillOutputSingle(
        'MI5.Module1101.Output.SkillOutput', 0));
  });

  opcuaInstance.initialize(); // when all callbacks are registered - initialize
};

exports.moduleInterface = function(req, res) {
};