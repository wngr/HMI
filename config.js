/**
 * Configuration File for the HMI
 * 
 * endPointURL for OPC UA Server
 * other stuff
 * 
 * @author Thomas Frei
 * @date 2014-10-10
 */

// task Id beginning point (random number between 1 and 100
exports.TaskId = Math.floor((Math.random() * 100) + 1); ;

// ModuleId - Manual
exports.MANUALMODULEID = 2403;

// ModuleId - Input
exports.OPCUAInputModuleId = 2501;

// ModuleId - Output
exports.OPCUAOutputModuleId = 2601;


var what = 'live';
/*
 * OPCUA Test Server-Configuration ITQ Lan
 */
if (what == 'hmitest'){
  exports.Port            = 3001;
  exports.OPCUARecipe       = 'opc.tcp://192.168.192.65:4840/';
  exports.OPCUAOrder        = 'opc.tcp://192.168.192.65:4840/';
  exports.OPCUAMessageFeed  = 'opc.tcp://192.168.192.65:4840/';
  exports.OPCUATask         = 'opc.tcp://192.168.192.65:4840/';
  exports.OPCUAHandModule   = 'opc.tcp://192.168.192.65:4840/';
  exports.OPCUAInputModule  = 'opc.tcp://192.168.192.76:4840/';
  exports.OPCUAOutputModule  = 'opc.tcp://192.168.192.76:4840/';
}

/*
 * OPCUA Global Server-Configuration ITQ Lan
 */
if (what == 'live'){
  exports.Port              = 3000;
  exports.OPCUARecipe       = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAOrder        = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAMessageFeed  = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUATask         = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAHandModule   = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAInputModule  = 'opc.tcp://192.168.192.76:4840/';
  exports.OPCUAOutputModule  = 'opc.tcp://192.168.192.76:4840/';
}

