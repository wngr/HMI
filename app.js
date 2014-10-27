
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
GLOBAL._ = require('underscore');
var router = require('./routes/router'); // Control
GLOBAL.md5 = require('MD5');

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
 * Control
 * Express Routes
 */
app = router.router(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*
 * Exit Node-JS Application after n seconds. 
 */
if( CONFIG.terminateAfterTimeout ){
  setTimeout(function(){
    console.log('----Terminated');
    process.exit(0);
  }, CONFIG.terminateAfterTimeout);  
}
