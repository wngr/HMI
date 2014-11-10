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
exports.OPCUARecipe = 'opc.tcp://192.168.175.230:4840/'; //.209 for virtual machine hmidev
exports.OPCUAOrder = 'opc.tcp://192.168.175.230:4840/';

/*
 * Starting TaskID, will be incremented during program
 */
exports.TaskId = 1;

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