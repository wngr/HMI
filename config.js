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
 * OPCUA Servers 
 */
exports.OPCUARecipe       = 'opc.tcp://192.168.175.230:4840/'; //.209 for virtual machine hmidev
exports.OPCUAOrder        = 'opc.tcp://192.168.175.230:4840/';
exports.OPCUAMessageFeed  = 'opc.tcp://192.168.175.230:4840/';
exports.OPCUATask         = 'opc.tcp://192.168.175.230:4840/';
exports.OPCUAHandModule   = 'opc.tcp://192.168.175.230:4840/';

/*
 * Starting TaskID, will be incremented during program
 */
exports.TaskId = 1;

//exports.terminateAfterTimeout = 5000;