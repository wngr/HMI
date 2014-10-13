
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
  
});




exports.index = function(req, res){
  res.render('bootstrap/socket');
};