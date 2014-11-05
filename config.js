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
//exports.terminateAfterTimeout = 20*1000;

/**
 * Terminates the application after disconnect
 */
exports.terminateAfterDisconnect = true;

exports.taskId = 1;

/*
 * MessageFeed
 */
exports.messageFeedUrl = 'opc.tcp://192.168.175.230:4840';

function ModuleIdEndpointUrl(moduleId){
  var endpointUrl = '';
  switch (moduleId) {
    case 1101:
    case 1102:
    case 1103:
      endpointUrl = "localhost";
      break;
    case 2001:
    case 2002:
    case 2003:
      endpointUrl = "192.168.175.210:4840";
      break;
    case 2401:
    case 2402:
      endpointUrl = "192.168.175.213:4840";
      break;
    default:
      console.log('there is no correspondent IP:Port for the moduleid:', moduleId);
      return false;
  }
  return 'opc.tcp://'+endpointUrl;
}
exports.ModuleIdToEndpointUrl = ModuleIdEndpointUrl;