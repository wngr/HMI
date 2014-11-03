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

var recipeInterface = require('./../models/recipeInterface');
recipeInterface.setRecipeUrl('opc.tcp://localhost:4334/');

// Test for all recipes -- first
// recipeInterface.getAllRecipes(function(recipes) {
// console.log(recipes);
// });

// Test for recipeIdArray
// recipeInterface.getRecipes([ 0, 2 ], function(recipes) {
// console.log(recipes);
// });

recipeInterface.setQueueUrl('opc.tcp://localhost:4334/');
recipeInterface.order(0, [ 40, 20 ], 3, function() {
  console.log('order executed');
})