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
var lucid = new lucidJS.EventEmitter();

GLOBAL.IO = require('socket.io').listen(server);
GLOBAL.io = IO;
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
var async = require('async');

GLOBAL.CONFIG = require('./../config.js');

GLOBAL.mi5Camera = new require('./../models/mi5Camera').newMi5Camera;

async.series([function(callback){
 mi5Camera.subscribe();
}
], function(err, results){
//  console.log(JSON.stringify(mi5Input.jadeData, null, 1));
  console.log('=-=-=-=-=-=-=-=-=-=-=-=-=');
});