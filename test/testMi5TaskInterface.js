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

GLOBAL.mi5TaskInterface = new require('./../models/mi5TaskInterface').newTaskInterface;

async.series([function(callback){
  mi5TaskInterface.initialize(callback);
}, function(callback){
//  mi5TaskInterface.getSingleTask(1,callback);
  mi5TaskInterface.getTaskListReduced(callback);
}, function(callback){
  console.log(mi5TaskInterface.taskList);
  callback();
}, function(callback){
  mi5TaskInterface.subscribe();
  callback();
}, 
//function(callback){
//  var Mi5ManualModule = require('./../models/simpleDataTypeMapping.js').Mi5ManualModule;
//  mi5TaskInterface.opc.mi5WriteObject('MI5.Module2402Manual', {Execute: true}, Mi5ManualModule, function(
//      err) {
//    console.log('Mi5ManualModule written - no error feedback possible');
//  });
//}, 
//function(callback){
//  mi5TaskInterface.setObject('MI5.Module2402Manual', {Execute: true}, function(err){
//    console.log('ok');
//  });
//}, 
//function(callback){
//  mi5TaskInterface.setValue('MI5.Module2402Manual.Execute', true, function(err){
//    console.log('ok');
//  });
//}
], function(err, results){
  console.log(mi5TaskInterface.jadeData);
});
