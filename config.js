/**
 * Configuration File for the HMI
 * 
 * endPointURL for OPC UA Server
 * other stuff
 * 
 * @author Thomas Frei
 * @date 2014-10-10
 */

// task Id beginning point (random number between 1 and 10000
exports.TaskId = Math.floor((Math.random() * 1000) + 1); ;

//////////////////////////////////////////////////////////////////////////////
// Commandline
var port = undefined;
var server = undefined;
process.argv.forEach(function(val, index, array) {
  if(val.slice(0,6)=='-port='){
    port = val.slice(6);
  }
  if(val.slice(0,8)=='-server='){
    server = val.slice(8);
  }
});

// Default Commandline
if(!server){
  server = 'live';
}
console.log('Using Server Setup'.bgGreen, server);

if(!port){
  port = 3000;
}
exports.Port = port;

exports.OutputPositionOutput = 1300;
exports.InputPositionOutput = 200;

//////////////////////////////////////////////////////////////////////////////
// Preconfigured Server
/*
 * OPCUA Test Server-Configuration ITQ Lan
 */
if (server == 'hmitest'){
  exports.OPCUARecipe             = 'opc.tcp://192.168.192.80:4840/';
  exports.OPCUAOrder              = 'opc.tcp://192.168.192.80:4840/';
  exports.OPCUAMessageFeed        = 'opc.tcp://192.168.192.80:4840/';
  exports.OPCUATask               = 'opc.tcp://192.168.192.80:4840/';
  exports.OPCUAHandModule         = 'opc.tcp://192.168.192.80:4840/';
  exports.OPCUAMaintenanceModule  = 'opc.tcp://192.168.192.80:4840/';
  exports.OPCUAInputModule        = 'opc.tcp://192.168.192.117:4840/'; // ModuleX
  exports.OPCUAOutputModule       = 'opc.tcp://192.168.192.117:4840/';
  exports.FTPCamera               = '192.168.192.128'; // BR Panel
}

/*
 * OPCUA Global Server-Configuration ITQ Lan
 */
if (server == 'live'){
  exports.OPCUARecipe           = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAOrder            = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAMessageFeed      = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUATask             = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAHandModule       = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAMaintenanceModule= 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAInputModule      = 'opc.tcp://192.168.192.117:4840/'; // ModuleX
  exports.OPCUAOutputModule     = 'opc.tcp://192.168.192.117:4840/';
  exports.FTPCamera               = '192.168.192.128'; // BR Panel
}

/*
 * OPCUA Test Server-Configuration ITQ Lan
 */
if (server == 'clone'){
  exports.OPCUARecipe             = 'opc.tcp://192.168.192.128:4840/';
  exports.OPCUAOrder              = 'opc.tcp://192.168.192.128:4840/';
  exports.OPCUAMessageFeed        = 'opc.tcp://192.168.192.128:4840/';
  exports.OPCUATask               = 'opc.tcp://192.168.192.128:4840/';
  exports.OPCUAHandModule         = 'opc.tcp://192.168.192.128:4840/';
  exports.OPCUAMaintenanceModule  = 'opc.tcp://192.168.192.128:4840/';
  exports.OPCUAInputModule        = 'opc.tcp://192.168.192.117:4840/'; // ModuleX
  exports.OPCUAOutputModule       = 'opc.tcp://192.168.192.117:4840/';
  exports.FTPCamera               = '192.168.192.128'; // BR Panel
}


exports.MAINTENANCEMODULEID = 2402;

