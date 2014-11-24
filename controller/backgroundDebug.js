/**
 * Perform debugging events
 * 
 * @author Thomas Frei
 * @date 2014-11-14
 */

function preLog() {
  return 'Debug:'.bgRed.underline;
}

/**
 * service()-Function is executed by backgroundServices.js
 * 
 * @constructor
 */
function service() {
}
exports.service = service;

var Mi5DebugMapping = require('./../models/simpleDataTypeMapping.js').Mi5Debug;

function sockets(socket) {
  socket.on('bgDebugOrderPendingFalse', function(data) {
    console.log(preLog(), 'socket.on : bgDebugOrderPendingFalse');

    // Set Order[0].Pending = false
    var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAOrder);
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }

      var writethis = {
        Pending : false
      };

      opc.mi5WriteObject('MI5.Order[0].', writethis, Mi5DebugMapping, function(err) {
        console.log(preLog(), 'Mi5DebugPendingFalse written - no error feedback possible');
        opc.disconnect();
      }); // end opc.Mi5WriteObject
    }); // end opc.initialize
  }); // end socket.on

  socket.on('bgDebugClearTaskList', function(data) {
    console.log(preLog(), 'clear task list registered');

    var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.192.116:4840');
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }

      var writethis = {
        ClearTaskList : true
      };

      opc.mi5WriteObject('MI5.', writethis, Mi5DebugMapping, function(err) {
        console.log(preLog(), 'Clear Task TRUE');
        opc.disconnect();
      }); // end opc.Mi5WriteObject
    }); // end opc.initialize
  }); // end socket.on

  socket.on('bgDebugResetProcessTool', function(data) {
    console.log(preLog(), 'Reset Process Tool event registered');

    var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.192.117:4840');
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }

      var writethis = {
        ResetProcessTool : true
      };

      opc.mi5WriteObject('MI5.', writethis, Mi5DebugMapping, function(err) {
        console.log(preLog(), 'Process Tool RESET');
        opc.disconnect();
      }); // end opc.Mi5WriteObject
    }); // end opc.initialize
  }); // end socket.on

  // ////////////////////////////////////////////////////////////////////////////////
  // /////////////////// Reset XTS
  // Reset the skills of the XTS (if PT makes an error) (just true)
  socket.on('bgDebugResetXTS', function(data) {
    console.log(preLog(), 'XTS - Reset XTS - event');

    var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.192.137:4840');
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }

      var writethis = {
        ResetXTS : true
      };

      opc.mi5WriteObject('MI5.', writethis, Mi5DebugMapping, function(err) {
        console.log(preLog(), 'XTS - Reset XTS - written true');
        opc.disconnect();
      }); // end opc.Mi5WriteObject
    }); // end opc.initialize
  }); // end socket.on

  // /////////////////// Maintenance
  // If true, one mover to a maintenance position, if false, then mover free
  // several times to get all movers
  socket.on('bgDebugMaintenanceTrue', function(data) {
    console.log(preLog(), 'XTS - Maintenance - event true');

    var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.192.137:4840');
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }

      var writethis = {
        Maintenance : true
      };

      opc.mi5WriteObject('MI5.', writethis, Mi5DebugMapping, function(err) {
        console.log(preLog(), 'XTS - Maintenance - written true');
        opc.disconnect();
      }); // end opc.Mi5WriteObject
    }); // end opc.initialize
  }); // end socket.on
  socket.on('bgDebugMaintenanceFalse', function(data) {
    console.log(preLog(), 'XTS - Maintenance - event false');

    var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.192.137:4840');
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }

      var writethis = {
        Maintenance : false
      };

      opc.mi5WriteObject('MI5.', writethis, Mi5DebugMapping, function(err) {
        console.log(preLog(), 'XTS - Maintenance - written false');
        opc.disconnect();
      }); // end opc.Mi5WriteObject
    }); // end opc.initialize
  }); // end socket.on
  // /////////////////// Restart
  // Sets all mover to their starting position
  socket.on('bgDebugRestartXTS', function(data) {
    console.log(preLog(), 'XTS - Restart XTS - event');

    var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.192.137:4840');
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }

      var writethis = {
        Restart : true
      };

      opc.mi5WriteObject('MI5.', writethis, Mi5DebugMapping, function(err) {
        console.log(preLog(), 'XTS - Restart XTS - written true');
        opc.disconnect();
      }); // end opc.Mi5WriteObject
    }); // end opc.initialize
  }); // end socket.on
}
exports.sockets = sockets;
