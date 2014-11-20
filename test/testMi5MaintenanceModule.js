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

//Lucid JS
var lucidJS = require('lucidjs');
var lucid = new lucidJS.EventEmitter();

GLOBAL.IO = require('socket.io').listen(server);
GLOBAL.io = IO;
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
var async = require('async');

var maintenanceModule = new require('./../models/mi5MaintenanceModule').maintenanceModule;

async.series([function(callback){
  maintenanceModule.initialize(callback);
}, function(callback){
  maintenanceModule.getModuleData(callback);
}, function(callback){
  maintenanceModule.subscribe();
  callback();
}, function(callback){
  var Mi5ManualModule = require('./../models/simpleDataTypeMapping.js').Mi5ManualModule;
  maintenanceModule.opc.mi5WriteObject('MI5.Module2402.Manual', {Execute: true}, Mi5ManualModule, function(
      err) {
    console.log('Mi5ManualModule written - no error feedback possible');
  });
}
], function(err, results){
  console.log(maintenanceModule.jadeData);
});