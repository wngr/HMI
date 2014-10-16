/**
 * route to test Opcua model
 */

opcua = require('./../models/opcua');

opcua.on('readFinished', function(data) {
  console.log(data[0].value.value);
});

opcua.on('writeFinished', function(){ console.log('erster schreiberversuch geglueckt.'); }); 

opcua.on('monitoredItemChanged', function(data){ 
  console.log('changed in subscription: ', data.value.value);
});

opcua.on('ready', function(){ 
//  opcua.browse('RootFolder');
 // opcua.browse('RootFolder.MyDevice');
//  opcua.read('ns=4;s=free_memory');
//  opcua.read('ns=4;b=1020FFAA');

//  opcua.write('ns=4;b=1020FFAA', 1337);
  
  opcua.subscribe();
  opcua.monitor('ns=4;s=free_memory');
});

/*
 * Initialize at the end, because all the event-handlers needs to be registered beforehand!
 */
opcua.initialize();
//setTimeout(opcua.disconnect, 1000);