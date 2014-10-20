/**
 * Configuration File for the HMI
 * 
 * endPointURL for OPC UA Server
 * other stuff
 * 
 * @author Thomas Frei
 * @date 2014-10-10
 */

/**
 * endpointUrl to the OPC UA Server.
 */
exports.endpointUrl = 'opc.tcp://localhost:4334/UA/SampleServer';
//exports.endpointUrl = "opc.tcp://192.168.175.230:4840";

/**
 * Exit Node-JS Application after n seconds. 
 */
//exports.terminateAfterTimeout = 10000;

/**
 * Terminates the application after disconnect
 */
exports.terminateAfterDisconnect = true;
