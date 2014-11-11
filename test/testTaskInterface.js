/**
 * TEST recipeInterface.js
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
GLOBAL.CONFIG = require('./../config.js');

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path'), express = require('express'), app = express(), http = require('http'), server = http
    .createServer(app);

GLOBAL.IO = require('socket.io').listen(server);
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');

var taskInterface = require('./../models/simpleTaskInterface');

// Test for all recipes -- first
// recipeInterface.getAllRecipes(function(recipes) {
// console.log(recipes);
// });

// Test Blank
var blankTask = taskInterface.getBlankTask();
// Test for taskIdArray
taskInterface.getTasks([ 0, 2 ], function(err, tasks) {
  console.log(err, tasks);
  // console.log(JSON.stringify(tasks, null, 1));
});

// recipeInterface.setQueueUrl('opc.tcp://192.168.175.230:4840/');
// recipeInterface.whenQueueReady(function() {
// console.log('QueueReady');
// });
//
// recipeInterface.order(12, [ 40, 20 ], function(err) {
// console.log('order executed');
// console.log(err);
// });
// console.log(taskInterface._123n(0, 20));
