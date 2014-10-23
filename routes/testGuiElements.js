
var input;
var opcua = require('./../models/opcua');

input = {
    name: 'Output.ConnectionTestOutput',
    nodeId: 'ns=4;s=MI5.Module1101.Output.ConnectionTestOutput',
    domId: 'ns4',
    reqEvent: 'dasRequestEvent',
    resEvent: 'dasRequestEvent'
};

//setTimeout();


/*
 * NodeID and Valuebox parameters
 */
IO.on('connection', function(socket){
  console.log('testGuiElements IO.e.connection');

//  opcua.on('readFinished', function(data){
//    if( data.nodeId == input.nodeId ){
//      socket.emit(input.resEvent, data);
//      console.log('Read Finished');
//    }
//  });
//  opcua.read(nodeId);

  
  socket.on(input.reqEvent, function(){
    console.log('da ist es - lese');
    opcua.read(input.nodeId);
  })
  opcua.on('readFinished', function(data){
    if( data.nodeId == input.nodeId ){
      console.log('da ist es - lese fertig - emit resEvent');
      socket.emit(input.resEvent, data);
    }
  });
  
  opcua.initialize();
});



exports.index = function(req, res){
  res.render('bootstrap/testGuiElements', {data: input});
};
