/**
 * Perform debugging events
 * 
 * @author Thomas Frei
 * @date 2014-11-14
 */

/**
 * work()-Function is executed by backgroundServices.js
 * 
 * @constructor
 */
function work(){
  orderPendingFalse();
}
exports.work = work;

function listeners(socket){
  socket.on('bgDebugOrderPendingFalse', function(data){
    console.log('socket.on : bgDebugOrderPendingFalse');
    
    // Set Order[0].Pending = false
    var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAOrder);
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }                    
      
      var mappingMi5DebugPendingFalse = require('./../models/simpleDataTypeMapping.js').Mi5DebugPendingFalse;
      
      var writethis = {
        Pending : false
      };
      
      opc.mi5WriteObject('MI5.Order[0].', writethis, mappingMi5DebugPendingFalse, function(err) {
          console.log('Mi5DebugPendingFalse written - no error feedback possible');
          opc.disconnect();
      });

    });
  });
}
exports.listeners = listeners;

/**
 * Sends time Object to the Browser, needed for Top-Navigation
 */
function orderPendingFalse(){
}