
/**
 * Configuration
 */
var  config = require('./config'); 

/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');

/**
 * Controls / Routes
 */
var hmiDev    = require('./routes/hmidev');
var user      = require('./routes/user');
var basicRead = require('./routes/basicread');
var bootstrap = require('./routes/bootstrap');
var dashBoard = require('./routes/dashboard');

var app = express();

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

app.get('/', hmiDev.index);
app.get('/users', user.list);
app.get('/basicread', basicRead.index);
app.get('/dashboard', dashBoard.index);
app.get('/dashboard/module', dashBoard.module);
app.get('/bootstrap', bootstrap.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*
 * End Node-JS Application after n seconds. 
 * It is enerving to end it in eclipse all the time.
 */
setTimeout(function(){
  process.exit(0);
}, 2000);
