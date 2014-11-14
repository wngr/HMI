
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

  opcua.on('monitoredItemChanged', function(data){ 
//    console.log('changed in subscription: ', data.value.value);
    socket.emit('ns1i1001', data.value.value);
    console.log(data);
  });
  
});




exports.index = function(req, res){
  res.render('bootstrap/socket');
};