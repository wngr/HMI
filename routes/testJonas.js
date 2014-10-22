
/*
 * Each route needs its own.
 */

/*
 * Socket Connection handling
 */
IO.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('isLive', function(){
    console.log('user is live');
  })
  
  socket.emit('info', { msg: 'The world is round, there is no up or down.' });
  
  setInterval(function(){
    socket.emit('socket_clock', Date().toString()); 
    //console.log(Date().toString());
  }, 1000);

  
  socket.on('specialKeyUp', function(){
    console.log('specialKeyUp event');
    opcua.read('ns=4;s=GVL.OPCModule[1].Output.SkillOutput.SkillOutput[1].Ready');
  });

  
  //opcua.on('readFinished', function(data){ console.log('haloho');});
  
  
});

opcua.on('readFinished', function(data){ console.log(data)});

var ni = 'ns=4;s=GVL.OPCModule[1].Output.SkillOutput.SkillOutput[1].Ready';

console.log(_.uniqueId('ns=4;s=GVL.OPCModule[1].Output.SkillOutput.SkillOutput[1].Ready'));

exports.index = function(req, res){
  var data = {
      IDread1: 'readid1',
      IDwrite1: 'writeID123'
  };
  res.render('bootstrap/testJonas', data);
};