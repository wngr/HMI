/**
 * New node file
 */

/**
 * Configuration
 */
GLOBAL.CONFIG = require('./../config.js'); 

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
GLOBAL.IO = require('socket.io').listen(server); 
GLOBAL._ = require('underscore');

/*
 * Map-Test
 */
//var nodeIds = ['ns=4',
//           'ns-5',
//           'lfldks'
//           ];
//console.log(nodeIds);
//
//var newNodeIds = _.map(nodeIds, function(id){ return {nodeId: id}})
//
//console.log(newNodeIds);

console.log('=======================================================');
console.log('=======================================================');


var opcuaModule1 = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');

opcuaModule1.on('readArrayFinished', function(data){
  console.log(JSON.stringify(data));

  console.log('=======================================================');
  console.log('=======================================================');
  
  var NewData[];
  for ( var i = 0; i <= data.length; i++){
   // NewData[] = { data[i].value
  }
  console.log( data[0] );
  console.log( data[1] );
  
  console.log( _.union(data[0], data[1]));
});

opcuaModule1.on('ready', function(){
  var NodesToRead = ['ns=4;s=MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy',
                    'ns=4;s=MI5.Module1101.Output.SkillOutput.SkillOutput0.Ready'];
  opcuaModule1.readArray(NodesToRead);
});

opcuaModule1.initialize();

  setTimeout(function(){
    console.log('----Terminated');
    process.exit(0);
  }, 1000);  