
/**
 * Configuration
 */
GLOBAL.CONFIG = require('./../config.js'); 

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path'),
  express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app);

GLOBAL.IO = require('socket.io').listen(server); 
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');

var opcuaModule1 = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');

opcuaModule1.on('readArrayFinished', function(data){
  console.log('=======================================================');
  console.log('=======================================================');
  console.log(JSON.stringify(data, null, 1));  

  /*
   * When the array is read, subscribe to all the nodes, that belong to that skill!
   */
  opcuaModule1.subscribe();
  data.forEach(function(entry){
    var myNode = opcuaModule1.monitor('ns=4;s='+entry.nodeId);
    myNode.on("changed", function(data){
      console.log('changed:',entry.nodeId,data);
      socket.emit(entry.updateEvent, entry.value);
    });
    
    console.log('added monitord item on:',entry.nodeId);
  });
});

opcuaModule1.on('ready', function(){
  var NodesToRead = ['MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy',
                     'MI5.Module1101.Output.SkillOutput.SkillOutput0.Ready',
                     'MI5.Module1101.Output.SkillOutput.SkillOutput0.Done'];
  
  opcuaModule1.readArray(opcuaModule1.nodeArraySkillOutputSingle('MI5.Module1101.Output.SkillOutput', 0));

 // opcuaModule1.on('monitoredItemChanged', function(data){ console.log(data); });

});

opcuaModule1.initialize();

//setTimeout(function(){
//  console.log('----Terminated');
//  process.exit(0);
//}, 1000);  