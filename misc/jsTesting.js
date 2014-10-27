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
GLOBAL.md5 = require('MD5');

var opcuaModule1 = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');

opcuaModule1.on('readArrayFinished', function(data){
  console.log('=======================================================');
  console.log('=======================================================');
  console.log(JSON.stringify(data, null, 1));  
});

opcuaModule1.on('ready', function(){
  var NodesToRead = ['MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy',
                     'MI5.Module1101.Output.SkillOutput.SkillOutput0.Ready',
                     'MI5.Module1101.Output.SkillOutput.SkillOutput0.Done'];
  opcuaModule1.readArray(NodesToRead);
  opcuaModule1.readArray(opcuaModule1.nodeArrayParameterOutputSingle('MI5.Module1101.Output.SkillOutput.SkillOutput0.ParameterOutput',0));
  opcuaModule1.readArray(opcuaModule1.nodeArraySkillOutputSingle('MI5.Module1101.Output.SkillOutput',0));
  
});


opcuaModule1.initialize();

setTimeout(function(){
  console.log('----Terminated');
  process.exit(0);
}, 1000);  