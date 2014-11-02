/**
 * Configuration
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

var moduleInterface = require('./../models/moduleInterface');
moduleInterface.setEndpointUrl('opc.tcp://localhost:4334/');
moduleInterface.setModule('Module1101');

// get Complete Module List
// moduleInterface.getCompleteModuleData(function(output) {
// console.log(output);
// });

moduleInterface.setSkill(1);
var parameters = moduleInterface.getParameters(function(parameters) {
  console.log(parameters);
});
