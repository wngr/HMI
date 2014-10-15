
/**
 * Configuration
 */
var config = require('./config'); 

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
GLOBAL.io = require('socket.io').listen(server);

/*
 * Testing
 */
var meinModelTest = require('./models/modeltest.js');
meinModelTest.on('birth', function(msg){ console.log('A birth happened: ' + msg)});

console.log('====================================');
/**
 * Controls / Routes
 */
var hmiDev    = require('./routes/hmidev');
var user      = require('./routes/user');
var basicRead = require('./routes/basicread');
var bootstrap = require('./routes/bootstrap');
var dashBoard = require('./routes/dashboard');
var testSocket = require('./routes/testSocket');
var controlOpcuaSocket = require('./routes/testOpcuaSocket');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * Express Routes
 */
app.get('/', hmiDev.index);
app.get('/users', user.list);
app.get('/basicread', basicRead.index);
app.get('/dashboard', dashBoard.index);
app.get('/dashboard/module', dashBoard.module);
app.get('/bootstrap', bootstrap.index);
app.get('/testSocket', testSocket.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*
 * Exit Node-JS Application after n seconds. 
 * It is enerving to end it in eclipse all the time.
 */
setTimeout(function(){
  console.log('----Terminated');
  process.exit(0);
}, 5000);
