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

var interface = require('./../models/simpleManualModule');

// Test Data
interface.getModuleData(2401, function(err, tasks, data) {
  console.log(err, tasks, data);
  // console.log(JSON.stringify(tasks, null, 1));
});
