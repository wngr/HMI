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

GLOBAL.mi5Input = new require('./../models/mi5InputModule').newInputModule;

async.series([function(callback){
  mi5Input.initialize(callback);
}, function(callback){
  mi5Input.getModuleData(callback);
}, function(callback){
  mi5Input.makeItReady(callback);
},
//function(callback){
//  mi5Input.subscribe();
//  callback();
//}, 
//function(callback){
//  var Mi5ManualModule = require('./../models/simpleDataTypeMapping.js').Mi5ManualModule;
//  mi5Input.opc.mi5WriteObject('MI5.Module2402Manual', {Execute: true}, Mi5ManualModule, function(
//      err) {
//    console.log('Mi5ManualModule written - no error feedback possible');
//  });
//}, 
//function(callback){
//  mi5Input.setObject('MI5.Module2402Manual', {Execute: true}, function(err){
//    console.log('ok');
//  });
//}, 
//function(callback){
//  mi5Input.setValue('MI5.Module2402Manual.Execute', true, function(err){
//    console.log('ok');
//  });
//}
function(callback){
//  setTimeout(callback, 1000);
  callback();
}
], function(err, results){
//  console.log(JSON.stringify(mi5Input.jadeData, null, 1));
  console.log('=-=-=-=-=-=-=-=-=-=-=-=-=');
  
  mi5Input.opc.disconnect();
});