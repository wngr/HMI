/*
 * Models
 * 
 * Strange: Sometimes it works, sometimes not.
 * Somehow it has to do with IO connection and socket I think.
 */

console.log('testModuleView.js / root');

// console.log(_.uniqueId(myNodeId));
exports.index = function(req, res) {
  var opcuaInstance = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');
  jadeData = {};

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

      /*
       * When the array is read, subscribe to all the nodes, that belong to that skill!
       */
      opcuaInstance.subscribe();
      data.forEach(function(entry) {
        var myNode = opcuaInstance.monitor('ns=4;s=' + entry.nodeId);
        myNode.on("changed", function(data) {
          console.log('changed:', entry.nodeId, data);
          IO.emit(entry.updateEvent, data);
        });

        console.log('added monitord item on:', entry.nodeId);
      });

      console.log('render');
      console.log(JSON.stringify(jadeData, null, 1));
      res.render('bootstrap/testModuleView', jadeData);
    }
    first();
  });

  opcuaInstance.on('ready', function() {
    opcuaInstance.readArray(opcuaInstance.nodeArraySkillOutputSingle(
        'MI5.Module1101.Output.SkillOutput', 0));
  });

  opcuaInstance.initialize(); // when all callbare registered - initializeacks
};

// SystemTime
setInterval(function() {
  IO.emit('serverTime', Date().toString());
}, 1000);

var connectedClients = 0;
IO.on('connection', function(socket) {
  connectedClients++;

  // Disconnect
  socket.on('disconnect', function() {
    console.log('Number of users from ', connectedClients, ' to ');
    connectedClients--;
    console.log(connectedClients);

    if (connectedClients === 0) {
      try {
        tryopcuaInstance.disconnect();
      } catch (err) {
        console.log(err);
      }
    }
  });
});

exports.moduleInterface = function(req, res) {
};