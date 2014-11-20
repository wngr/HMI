/**
 * Socket and Room Testing
 */

// Server Modules
var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

//Lucid JS for uber-simple event handling
var lucidJS = require('lucidjs');
GLOBAL.lucid = new lucidJS.EventEmitter();

//Socket
GLOBAL.IO = require('socket.io').listen(server); // deprecated
GLOBAL.io = IO;

// Helper
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
GLOBAL.moment = require('moment');

// Express Environments
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/../views'); // cause not in root folder, add /..
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
// Handling post requests:
app.use(express.urlencoded());
app.use(express.json());

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname,'../', 'public'))); // cause not in root folder, add ../

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//lucid.flag('asdf',1);

// Execute Router
app.get('/', function(req,res){
  IO.on('connection', function(socket){
    socket.join('manual-module');
    
    
    
  });
  
  lucid.flag('asdf',4);
  console.log(lucid);
  
  res.render('sbadmin2/socket_blank', {title: 123});
});


  
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


setInterval(function() {
  var now = moment();
  var serverTime = {
    serverTime : now.format('MMMM Do YYYY, H:mm:ss'),
    serverTimeHMS : now.format('HH:mm:ss'),
    serverTimeDay : now.format('dddd'),
    serverTimeDate : now.format('MMMM Do YYYY')
  };
  IO.emit('serverTime', serverTime);
}, 1000);


console.log(lucid);
lucid.bind('asdf', function(data){  
  console.log('loaded, yeah', data);
  IO.to('manual-module').emit('mmroom',123);
});