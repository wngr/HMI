/**
 * HMI MI5
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
GLOBAL.IO = require('socket.io').listen(server); 
GLOBAL.io = IO; 

// Node Modules
var colors = require('colors');
// Helper
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
GLOBAL.moment = require('moment');

// Configuration
GLOBAL.CONFIG = require('./config.js');

//********************************* Mi5 HMI Models *****************************************
// Logger
GLOBAL.mi5Logger = require('./models/mi5Logger').logger;
mi5Logger.start();

// Maintenance Module
GLOBAL.mi5Maintenance = require('./models/mi5MaintenanceModule').newMaintenanceModule;
mi5Maintenance.start(function(){});

//Manual Module
GLOBAL.mi5Manual = require('./models/mi5ManualModule').newManualModule;
mi5Manual.start(function(){});

// Input Module
GLOBAL.mi5Input = new require('./models/mi5InputModule').newInputModule;
mi5Input.start(function(){});

// Output Module
GLOBAL.mi5Output = new require('./models/mi5OutputModule').newOutputModule;
mi5Output.start(function(){});

// Task Interface
GLOBAL.mi5TaskInterface = new require('./models/mi5TaskInterface').newTaskInterface;
mi5TaskInterface.start(function(){});

// Camera Module
//GLOBAL.mi5Camera = new require('./models/mi5Camera').newMi5Camera; // Setup proper FTP server first

// Message Feed
GLOBAL.mMessageFeed = require('./models/simpleMessageFeed');

// Background Services
var services = require('./controller/backgroundServices'); 

// Basic controller
var router = require('./controller/router'); // Control

// Express Environments
app.set('port', CONFIG.Port);
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
  console.log('Express server listening on port'.bgGreen +' '+ app.get('port') );
});