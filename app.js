
/**
 * Configuration
 */
GLOBAL.CONFIG = require('./config.js'); 

/**
 * Global variable, so that subscriptions dont take place all the time, only when manual Module viewed.
 */
GLOBAL.ManualModuleActivated = 0;

// Server Modules
var path = require('path'),
  express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app);
//Socket
GLOBAL.IO = require('socket.io').listen(server); 
// Helper
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
GLOBAL.moment = require('moment');
// Models
GLOBAL.mManualModule = require('./models/simpleManualModule');

// Background Services
var services = require('./controller/backgroundServices'); 

// Basic controller
var router = require('./controller/router'); // Control

// Express Environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
// Handling post requests:
app.use(express.urlencoded());
app.use(express.json());

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Execute Router
app = router.router(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*
 * Bottom
 */
// Terminate after timeout
if( CONFIG.terminateAfterTimeout ){
  setTimeout(function(){
    console.log('----Terminated');
    process.exit(0);
  }, CONFIG.terminateAfterTimeout);  
}
