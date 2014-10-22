
/**
 * Configuration
 */
GLOBAL.CONFIG = require('./config.js'); 

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
GLOBAL.IO = require('socket.io').listen(server); 
GLOBAL.opcua = require('./models/opcua');
var _ = require('underscore');

/*
 * Controls / Routes
 */
var hmiDev    = require('./routes/hmidev');
var bootstrap = require('./routes/bootstrap');
var dashBoard = require('./routes/dashboard');
//var testSocket = require('./routes/testSocket');
//var testJonas = require('./routes/testJonas');
var testGuiElements = require('./routes/testGuiElements');
//var controlOpcuaSocket = require('./routes/testOpcua.js');


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
app.get('/bootstrap', bootstrap.index);
//app.get('/testSocket', testSocket.index);
//app.get('/testJonas', testJonas.index);
app.get('/testGuiElements', testGuiElements.index);

opcua.on('ready', _.once(function(){ 
  server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
}));

opcua.initialize();

/*
 * Exit Node-JS Application after n seconds. 
 */
if( CONFIG.terminateAfterTimeout ){
  setTimeout(function(){
    console.log('----Terminated');
    process.exit(0);
  }, CONFIG.terminateAfterTimeout);  
}
