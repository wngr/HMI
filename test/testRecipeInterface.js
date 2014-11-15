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

var recipeInterface = require('./../models/simpleRecipeInterface');
// recipeInterface.setRecipeUrl('opc.tcp://localhost:4334/');
// recipeInterface.setRecipeUrl('opc.tcp://192.168.175.230:4840/');

// Test for all recipes -- first
// recipeInterface.getAllRecipes(function(err, recipes) {
// console.log(recipes);
// });

// Test for recipeIdArray
// recipeInterface.getRecipes([ 0, 2 ], function(err, recipes) {
// console.log(recipes);
// });

recipeInterface.getRecipeByRecipeId(10000, function(err, recipes) {
  console.log(recipes);
});

// recipeInterface.setQueueUrl('opc.tcp://192.168.175.230:4840/');
// recipeInterface.whenQueueReady(function() {
// console.log('QueueReady');
// });

// recipeInterface.order(12, [ 40, 20 ], function(err) {
// console.log('order executed');
// console.log(err);
// });

