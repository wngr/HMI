
/*
 * Each route needs its own.
 */

/*
 * Socket Connection handling
 */
io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
  
  socket.emit('info', { msg: 'The world is round, there is no up or down.' });
  
  setInterval(function(){
    socket.emit('socket_clock', Date().toString());    
  });
  
  
});




exports.index = function(req, res){
  res.render('bootstrap/socket');
};