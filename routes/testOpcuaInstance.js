
//var nodeId = 'ns=4;s=MI5.Module1101.Output.ConnectionTestOutput';

var opcuaModule1 = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');

//opcuaModule1.on('readFinished', function(data){
//  console.log('Read-Module1: ConnectionTestOutput:', data.value);
//});

//opcuaModule1.on('monitoredItemChanged', function(data){console.log(data); });

/*
 * Arraytest
 */
opcuaModule1.on('readArrayFinished', function(data){console.log(data);});

opcuaModule1.on('ready', function(){
//  
//  console.log(opcuaModule1);
//  
//  setInterval( function(){
//    opcuaModule1.read(nodeId);
//  }, 10*1000);  
//  
//
//  opcuaModule1.subscribe();
//  opcuaModule1.monitor(nodeId);
//  opcuaModule1.monitor('ns=4;s=MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy');
//  
  /*
   * Arraytest
   */
  var NodesToRead = ['ns=4;s=MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy',
                    'ns=4;s=MI5.Module1101.Output.SkillOutput.SkillOutput0.Ready'];
  opcuaModule1.readArray(NodesToRead);

});

opcuaModule1.initialize();

return opcuaModule1;