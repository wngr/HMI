
/**
 * route to test Opcua model
 */

opcua.on('readFinished', function(data) {
  //console.log(data[0].value.value);
  //console.log(data[0].data.value.value);
});

opcua.on('writeFinished', function(){ console.log('erster schreiberversuch geglueckt.'); }); 

opcua.on('monitoredItemChanged', function(data){ 
  console.log('changed in subscription - new value: ', data.value.value);
});

opcua.on('ready', function(){ 
  opcua.subscribe();
  opcua.monitor('ns=4;s=GVL.OPCModule[1].Output.SkillOutput.SkillOutput[1].Ready');
  opcua.monitor('ns=4;s=GVL.OPCModule[1].Output.SkillOutput.SkillOutput[1].Busy');
});

/*
 * Initialize opcua class at the end, because all the event-handlers needs to be registered beforehand!
 */
opcua.initialize();