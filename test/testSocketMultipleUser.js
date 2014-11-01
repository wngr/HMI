/*
 * Test Single User Multiple Connections issue on socket.io
 * Literature:
 *    http://michaelheap.com/sending-messages-to-certain-clients-with-socket-io/
 *    https://coderwall.com/p/ekrcyw
 *    http://notjoshmiller.com/socket-io-rooms-and-redis/
 *    
 * This should be very good, too:
 *    http://tamas.io/advanced-chat-using-node-js-and-socket-io-episode-1/
 */

/***************************************************************************************************
 * Assertion and Configuration
 */
GLOBAL.CONFIG = require('./../config.js');

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path'), express = require('express'), app = express(), http = require('http'), server = http
    .createServer(app);

GLOBAL.IO = require('socket.io').listen(server);
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/../views'); // added ../ for file is in /test/-folder
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../public'))); // added ../ for file is in
// /test/-folder

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/***************************************************************************************************
 * Start Test Here
 */

setInterval(function() {
  console.log('broadcasting...');
  IO.emit('timeUpdate', Date().toString());
}, 1000);

var room = 'testRoom';
var data = new Object;
function socketIdTest(req, res) {
  IO.on('connection', function(socket) {
    socket.join(room);

    IO.on('disconnect', function() {
      var countRommClients = IO.sockets.clients(room).length;
      if (countRommClients == 1) {
        IO.disconnect();
      }
    });
  });

  res.render('bootstrap/testSocketMultipleUser', data);
}
app.get('/', socketIdTest);

/***************************************************************************************************
 * Start Server
 */
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
