/**
 * New node file
 */
var opcuaModule1 = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');

opcuaModule1.on('readFinished', function(data){
  console.log('Module1: ConnectionTestOutput:', data.value);
});

opcuaModule1.on('ready', function(){
  setInterval( function(){
    opcuaModule1.read('ns=4;s=MI5.Module1101.Output.ConnectionTestOutput');
  }, 2000);  
});

/*
 * Initialize opcua class at the end, because all the event-handlers needs to be registered beforehand!
 */
opcuaModule1.initialize();



var opcuaModule2 = require('./../models/opcuaInstance').server('opc.tcp://localhost:4335/');

opcuaModule2.on('readFinished', function(data){
  console.log('Module2: ConnectionTestOutput:', data.value);
});

opcuaModule2['on']('ready', function(){
  setInterval( function(){
    opcuaModule2.read('ns=4;s=MI5.Module1101.Output.ConnectionTestOutput');
  }, 2000);  
});

opcuaModule2.initialize();
