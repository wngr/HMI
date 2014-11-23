/**
 * TEST recipeInterface.js
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path'), express = require('express'), app = express(), http = require('http'), server = http
    .createServer(app), colors = require('colors');

//Lucid JS
var lucidJS = require('lucidjs');
GLOBAL.lucid = new lucidJS.EventEmitter();

GLOBAL.IO = require('socket.io').listen(server);
GLOBAL.io = IO;
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
var async = require('async');

GLOBAL.CONFIG = require('./../config.js');

GLOBAL.mi5Camera = new require('./../models/mi5Camera').newMi5Camera;

async.series([function(callback){
 callback();
}, function(callback){
  mi5Camera.getFileList(function(list){
    console.log(list);
    callback();
  });
  console.log('=-=-=-=-=-=-=-=-=-=-=-=-=');  
}, function(callback){
  console.log(mi5Camera.getLastPicture());
  callback();
}, function(callback){
  console.log(mi5Camera.getLastPictures(3));
  callback();
}
], function(err, results){
});