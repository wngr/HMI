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
 */
//exports.OPCUARecipe       = 'opc.tcp://192.168.175.230:4840/';
//exports.OPCUAOrder        = 'opc.tcp://192.168.175.230:4840/';
//exports.OPCUAMessageFeed  = 'opc.tcp://192.168.175.230:4840/';
//exports.OPCUATask         = 'opc.tcp://192.168.175.230:4840/';
//exports.OPCUAHandModule   = 'opc.tcp://192.168.175.230:4840/';
//

// ModuleId - Manual
exports.MANUALMODULEID = 2403;

// ModuleId - Maintenance
exports.MAINTENANCEMODULEID = 2402;

// ModuleId - Input
exports.OPCUAInputModuleId = 2501;

// ModuleId - Output
exports.OPCUAOutputModuleId = 2601;


var what = 'hmitest';
/*
 * OPCUA Test Server-Configuration ITQ Lan
 */
if (what == 'hmitest'){
  exports.Port                    = 3001;
  exports.OPCUARecipe             = 'opc.tcp://192.168.192.79:4840/';
  exports.OPCUAOrder              = 'opc.tcp://192.168.192.79:4840/';
  exports.OPCUAMessageFeed        = 'opc.tcp://192.168.192.79:4840/';
  exports.OPCUATask               = 'opc.tcp://192.168.192.79:4840/';
  exports.OPCUAHandModule         = 'opc.tcp://192.168.192.79:4840/';
  exports.OPCUAMaintenanceModule  = 'opc.tcp://192.168.192.79:4840/';
  exports.OPCUAInputModule        = 'opc.tcp://192.168.192.76:4840/';
  exports.OPCUAOutputModule       = 'opc.tcp://192.168.192.76:4840/';
}

/*
 * OPCUA Global Server-Configuration ITQ Lan
 */
if (what == 'live'){
  exports.Port                  = 3000;
  exports.OPCUARecipe           = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAOrder            = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAMessageFeed      = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUATask             = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAHandModule       = 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAMaintenanceModule= 'opc.tcp://192.168.192.116:4840/';
  exports.OPCUAInputModule      = 'opc.tcp://192.168.192.76:4840/';
  exports.OPCUAOutputModule     = 'opc.tcp://192.168.192.76:4840/';
}


exports.MAINTENANCEMODULEID = 2402;

