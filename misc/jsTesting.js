
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
  colors = require('colors');

var skillContainer;

GLOBAL.IO = require('socket.io').listen(server); 
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');

var temp = [1 ,2,3,4,5,1,7,4,3,4,5,3,2,3,7,6,5,866,5,66,5544,2];
console.log(_.first(temp,5));
temp.unshift(0);
console.log(_.first(temp,5));

console.log('test'.green);

process.argv.forEach(function(val, index, array) {
  if(val.slice(0,6)=='-port='){
    console.log(val.slice(6));
  }
  if(val.slice(0,8)=='-server='){
    console.log(val.slice(8));
  }
});
