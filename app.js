/**
 * Configuration
 */
GLOBAL.CONFIG = require('./config.js'); 

// Node Modules
var colors = require('colors');

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

// Helper
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
GLOBAL.moment = require('moment');

//********************************* Mi5 HMI Models *****************************************
// Logger
GLOBAL.mi5Logger = require('./models/mi5Logger').logger;
mi5Logger.startUp();

// Maintenance Module
GLOBAL.mi5Maintenance = require('./models/mi5MaintenanceModule').newMaintenanceModule;
mi5Maintenance.initialize(function(err){
  if(!err){
    console.log('Maintenance Module is connected');
    mi5Maintenance.getModuleData(function(err){
      if(!err){
        mi5Maintenance.subscribe();
        mi5Maintenance.makeItReady();
      }
    });
  } else {
    console.log(err);
  }
});

//Manual Module
GLOBAL.mi5Manual = require('./models/mi5ManualModule').newManualModule;
mi5Manual.initialize(function(err){
  if(!err){
   console.log('Manual Module is connected');
   mi5Manual.getModuleData(function(err){
     if(!err){
       mi5Manual.subscribe();
       mi5Manual.makeItReady();
     }
   });
  } else {
    console.log(err);
  }
});

// Input Module
GLOBAL.mi5Input = new require('./models/mi5InputModule').newInputModule;
mi5Input.initialize(function(err){
  if(!err){
   console.log('Input Module is connected');
   mi5Input.getModuleData(function(err){
     if(!err){
       mi5Input.subscribe();
       mi5Input.makeItReady(function(){});
     }
   });
  } else {
   console.log(err);
  }
});

//Output Module
GLOBAL.mi5Output = new require('./models/mi5OutputModule').newOutputModule;
mi5Output.initialize(function(err){
  if(!err){
    console.log('Output Module is connected');
    mi5Output.getModuleData(function(err){
      if(!err){
        mi5Output.subscribe();
        mi5Output.makeItReady(function(){});
      }
    });
  } else {
    console.log(err);
  }
});


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
  console.log('Express server listening on port '.green + app.get('port') );
});