/*
 * Models
 * 
 * Strange: Sometimes it works, sometimes not.
 * Somehow it has to do with IO connection and socket I think.
 */

var myNodeId = 'ns=4;s=MI5.Module1101.Output.SkillOutput.SkillOutput0.Ready';

var globalI = 1;

// Value to Jade-Template
var field1 = {
  IDread1 : 'readid1',
  ReadEventName1 : 'readMyFinished',
  IDwrite1 : 'writeID123',
  EventName1 : 'specialKeyUp'
};

IO.on('connection', function(socket) {
  var opcua = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');
  console.log('a user connected');
  // opcua.removeAllListeners();

  // Disconnect
  socket.on('disconnect', function() {
    console.log('user disconnected');
    opcua.disconnect();
  });

  // SystemTime
  setInterval(function() {
    socket.emit('hmiSystemTime', Date().toString());
  }, 1000);

  socket.on(field1.EventName1, function(data) {
    console.log(field1.EventName1 + ' event', data);
    opcua.write(myNodeId, parseFloat(data.value));
  });

  opcua.on('ready', function() {
    opcua.read(myNodeId);
  });

  // Send it back to the readID text-field
  opcua.on('readFinished', function(data) {
    console.log('II:', globalI++, data);
    socket.emit(field1.ReadEventName1, data);
  });
  opcua.on('readFinished', function(data) {
    console.log('II:', globalI++, data);
    socket.emit(field1.ReadEventName1, data);
  });

  // Get the new Value as a request
  opcua.on('writeFinished', function() {
    opcua.read(myNodeId);
  });

  opcua.initialize(); // when all callbacks are registered - initialize
});

// console.log(_.uniqueId(myNodeId));

exports.index = function(req, res) {
  var moduleData = {
    moduleData : {
      name : 'Halloho',
      skills : {
        1 : {
          name : 'Testskill 1',
          skillid : 10000,
          ready : 1,
          busy : 1,
          done : 1,
          error : 1,
          parameters : {
            1 : {
              name : 'Geschwindigkeit',
              id : 432
            }
          }
        }
      }
    }
  };

  field1 = _.extend(field1, moduleData);

  res.render('bootstrap/testJonas', field1);
};