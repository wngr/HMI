/**
 * Maintenance Module in Class-Architecture
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-020
 */
var jadeH = require('./simpleJadeHelper');
var opcH = require('./simpleOpcuaHelper');
var assert = require('assert');

/**
 * maintenanceModule Class
 * 
 * @returns
 */
maintenanceModule = function() {
  this.NumberOfParameters = 5;

  this.isInitialized = false;
  this.rawData = undefined;
  this.jadeData = undefined;

  this.opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAMaintenanceModule);
};
exports.maintenanceModule = new maintenanceModule();

/**
 * initialize maintenance module opcua connection
 * 
 * @param callback
 */
maintenanceModule.prototype.initialize = function(callback) {
  var self = this;

  assert(typeof callback === "function");

  self.opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    } else {
      self.isInitialized = true;

      // Create a subscription
      self.opc.mi5Subscribe();
      callback(err);
    }
  });
};

/**
 * get module Data
 * 
 * @param callback
 */
maintenanceModule.prototype.getModuleData = function(callback) {
  var self = this;

  assert(self.isInitialized, 'opc is not initialized call self.initialize() *async* first');
  assert(typeof callback === "function");

  var baseNodeTask = self.structManualModule('MI5.Module' + CONFIG.MAINTENANCEMODULEID + 'Manual.');

  self.opc.mi5ReadArray(baseNodeTask, function(err, data) {
    var mi5Object = opcH.mapMi5ArrayToObject(data, self.structManualModuleObjectBlank());

    self.rawData = data;
    self.jadeData = mi5Object;
    callback(err); // final callback
  }); // end opc.mi5ReadArray
};

/**
 * 
 * @param rawData
 * @param callback
 */
maintenanceModule.prototype.subscribe = function() {
  var self = this;

  assert(self.isInitialized, 'opc is not initialized call self.initialize() *async* first');

  var monitor = [ {
    nodeId : self.jadeData.Busy.nodeId,
    callback : self.onBusyChange
  }, {
    nodeId : self.jadeData.Done.nodeId,
    callback : self.onDoneChange
  }, {
    nodeId : self.jadeData.Execute.nodeId,
    callback : self.onExecuteChange
  }, {
    nodeId : self.jadeData.Ready.nodeId,
    callback : self.onReadyChange
  } ];

  self.monitorItems(monitor);

  return 0;
};

maintenanceModule.prototype.onBusyChange = function(data) {
  console.log('onBusyChange', data.value.value);
};
maintenanceModule.prototype.onDoneChange = function(data) {
  console.log('onDoneChange', data.value.value);
};
maintenanceModule.prototype.onExecuteChange = function(data) {
  io.to('maintenance-module').emit('executeIsTrue', true);
  console.log('onExecuteChange', data.value.value);
};
maintenanceModule.prototype.onReadyChange = function(data) {
  console.log('onReadyChange', data.value.value);
};

/**
 * monitor a list of items and assign a callback event
 * 
 * @param itemArray
 *          <array> [{nodeId: '', callback: cbFunction}]
 * @returns <boolean>
 */
maintenanceModule.prototype.monitorItems = function(itemArray) {
  var self = this;

  assert(_.isArray(itemArray));

  itemArray.forEach(function(item) {
    mI = self.opc.mi5Monitor(item.nodeId);
    mI.on('changed', item.callback);
  });
  return true;
}

/**
 * 
 * @param socket
 */
maintenanceModule.prototype.ioRegister = function(socket) {
  var self = this;

  assert(typeof socket !== 'undefined');

  socket.on('userReady', function(data) {
    console.log('user is Ready');
  });
  socket.on('userDone', function(data) {
    console.log('user is DONE!');
  });

  console.log('OK - Maintenance Module - event listeners registered');
}

/**
 * 
 * @param nodeId
 * @param value
 */
maintenanceModule.prototype.setValue = function(baseNode, dataObject) {
  var self = this;

  assert(typeof baseNode === "string");
  assert(_.isObject(dataObject));

  var Mi5ManualModule = require('./../models/simpleDataTypeMapping.js').Mi5ManualModule;
  self.opc.mi5WriteObject(baseNode, dataObject, Mi5ManualModule, function(err) {
    console.log('OK - Maintenance Module - value written - no error feedback possible');
  });
}

/**
 * dummyStruct
 * 
 * @return <object>
 */
maintenanceModule.prototype.structManualModuleObjectBlank = function() {
  var self = this;

  // Base
  var handModuleDummy = {
    Ready : '',
    Busy : '',
    Done : '',
    Execute : '',
    Error : '',
    ErrorID : '',
    Parameter : [],
    Position : '',
    SkillDescription : '',
    SkillID : '',
    TaskID : ''
  };

  // Parameter
  _123n(0, self.NumberOfParameters).forEach(function(i) {

    var parameterDummy = {
      ID : '',
      Name : '',
      StringValue : '',
      Unit : '',
      Value : '',
    };
    handModuleDummy.Parameter.push(parameterDummy);

  }); // end forEach Parameter

  return handModuleDummy;
}

/**
 * @param baseNode
 *          <string>
 * @return array
 */
maintenanceModule.prototype.structManualModule = function(baseNode) {
  var self = this;

  var numberOfParameters = self.NumberOfParameters; // 5
  var nodes = [ 'Execute', 'Busy', 'Done', 'Error', 'ErrorID', 'Ready', 'SkillDescription',
      'SkillID', 'TaskID' ];
  // Add all 6 Parameters
  for (var i = 0; i <= numberOfParameters; i++) {
    var temp = self.structManuelModuleParameter('Parameter[' + i + '].');
    temp.forEach(function(item) {
      nodes.push(item);
    });
  }
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });

  return nodes;
}

/**
 * @param baseNode
 *          <string>
 * @return <array>
 */
maintenanceModule.prototype.structManuelModuleParameter = function(baseNode) {
  var nodes = [ 'ID', 'Name', 'StringValue', 'Unit', 'Value' ];
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });
  return nodes;
}

/**
 * Creates an array [startpoint,1,2,3,4,..., endpoint]
 * 
 * @param startpoint
 * @param endpoint
 * @returns {Array}
 */
function _123n(startpoint, endpoint) {
  var output = [];
  for (var i = startpoint; i <= endpoint; i++) {
    output.push(i);

    if (i == endpoint) {
      return output;
    }
  }
}
