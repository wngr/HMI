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
    IDread1: 'readid1',
    ReadEventName1: 'readMyFinished',
    IDwrite1: 'writeID123',
    EventName1: 'specialKeyUp'
};

IO.on('connection', function(socket){
  var opcua = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');
  console.log('a user connected');
  //opcua.removeAllListeners();
  
  // Disconnect
  socket.on('disconnect', function(){
    console.log('user disconnected');
    opcua.disconnect(); // not good - if one client/browser goes down, all is down
    //socket.removeAllListeners();
    //opcua.removeAllListeners(); // that works, but it destroys other clients connection
  });
  
  // SystemTime
  setInterval(function(){
    socket.emit('hmiSystemTime', Date().toString()); 
  }, 1000);

  socket.on(field1.EventName1, function(data){
    console.log(field1.EventName1 + ' event',data);
    opcua.write(myNodeId, parseFloat(data.value));
  });
  
  opcua.on('ready', function(){
    opcua.read(myNodeId);    
  });

  //Send it back to the readID text-field
  opcua.on('readFinished', function(data){
   console.log('II:', globalI++, data);
   socket.emit(field1.ReadEventName1, data );
  });
  //Get the new Value as a request
  opcua.on('writeFinished', function(){ opcua.read(myNodeId); });
  
  opcua.initialize() // when all callbacks are registered - initialize
});

//console.log(_.uniqueId(myNodeId));

exports.index = function(req, res){
  res.render('bootstrap/testJonas', field1);
};