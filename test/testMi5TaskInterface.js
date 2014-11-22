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
    .createServer(app), color = require('colors');

//Lucid JS
var lucidJS = require('lucidjs');
var lucid = new lucidJS.EventEmitter();

GLOBAL.IO = require('socket.io').listen(server);
GLOBAL.io = IO;
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');
var async = require('async');

var module = new require('./../models/mi5TaskInterface').newTaskInterface;

async.series([function(callback){
  module.initialize(callback);
}, function(callback){
//  module.getSingleTask(1,callback);
  module.getTaskListReduced(callback);
}, function(callback){
  console.log(module.taskList);
}, 
//function(callback){
//  var Mi5ManualModule = require('./../models/simpleDataTypeMapping.js').Mi5ManualModule;
//  module.opc.mi5WriteObject('MI5.Module2402Manual', {Execute: true}, Mi5ManualModule, function(
//      err) {
//    console.log('Mi5ManualModule written - no error feedback possible');
//  });
//}, 
//function(callback){
//  module.setObject('MI5.Module2402Manual', {Execute: true}, function(err){
//    console.log('ok');
//  });
//}, 
//function(callback){
//  module.setValue('MI5.Module2402Manual.Execute', true, function(err){
//    console.log('ok');
//  });
//}
], function(err, results){
  console.log(module.jadeData);
});

setTimeout(function(){
  process.exit(1);
}, 1000);