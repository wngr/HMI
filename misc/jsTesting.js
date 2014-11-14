
/**
 * Configuration
 */
GLOBAL.CONFIG = require('./../config.js'); 

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path'),
  express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app);

var skillContainer;

GLOBAL.IO = require('socket.io').listen(server); 
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
GLOBAL.moment = require('moment');

  console.log(moment());