/**
 * Configuration File for the HMI
 * 
 * endPointURL for OPC UA Server
 * other stuff
 * 
 * @author Thomas Frei
 * @date 2014-10-10
 */

/*
 * OPCUA Live Server (XTS-room)
 */
//exports.OPCUARecipe       = 'opc.tcp://192.168.175.230:4840/';
//exports.OPCUAOrder        = 'opc.tcp://192.168.175.230:4840/';
//exports.OPCUAMessageFeed  = 'opc.tcp://192.168.175.230:4840/';
//exports.OPCUATask         = 'opc.tcp://192.168.175.230:4840/';
//exports.OPCUAHandModule   = 'opc.tcp://192.168.175.230:4840/';
//

/*
 * OPCUA Test Server-Configuration (Thomas Frei)
 */
//exports.OPCUARecipe       = 'opc.tcp://192.168.0.22:4840/';
//exports.OPCUAOrder        = 'opc.tcp://192.168.0.22:4840/';
//exports.OPCUAMessageFeed  = 'opc.tcp://192.168.0.22:4840/';
//exports.OPCUATask         = 'opc.tcp://192.168.0.22:4840/';
//exports.OPCUAHandModule   = 'opc.tcp://192.168.0.22:4840/';


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

/*
 * Starting TaskID, will be incremented during program
 */
exports.TaskId = 1;

//exports.terminateAfterTimeout = 5000;

exports.MANUALMODULEID = 2403;