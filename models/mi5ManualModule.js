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
var _123n = opcH._123n;
var assert = require('assert');

/**
 * module Class
 * 
 * @returns
 */
module = function() {
  this.NumberOfParameters = 5;

  this.isInitialized = false;
  this.rawData = undefined;
  this.jadeData = undefined;

  this.socketRoom = 'manual-module';
  this.ModuleId = 2403;

  this.opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAHandModule);
  console.log(preLog(), 'endpoint', CONFIG.OPCUAHandModule);
};
exports.newManualModule = new module();

function preLog() {
  return 'Manual-Module: ';
}

/**
 * initialize maintenance module opcua connection
 * 
 * @param callback
 */
module.prototype.initialize = function(callback) {
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
module.prototype.getModuleData = function(callback) {
  var self = this;

  assert(self.isInitialized, 'opc is not initialized call self.initialize() *async* first');
  assert(typeof callback === "function");

  var baseNodeTask = self.structManualModule('MI5.Module' + self.ModuleId + 'Manual.');

  self.opc.mi5ReadArray(baseNodeTask, function(err, data) {
    var mi5Object = opcH.mapMi5ArrayToObject(data, self.structManualModuleObjectBlank());

    self.rawData = data;
    self.jadeData = mi5Object;
    callback(err); // final callback
  }); // end opc.mi5ReadArray
};

// /////////////////////////////////////////////////////////////////
// OPC UA Subscriptions

/**
 * subscribe all module-specific variables
 * 
 * @param rawData
 * @param callback
 */
module.prototype.subscribe = function() {
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

/**
 * mark initial state as ready
 * 
 * @param rawData
 * @param callback
 */
module.prototype.makeItReady = function() {
  var self = this;

  self.setValue(self.jadeData.Ready.nodeId, true, function() {
    console.log(preLog(), 'OK - Manual Module is ready');
  });
}

module.prototype.onBusyChange = function(data) {
  var self = mi5Manual; // since it is called before getModuleData

  if (data.value.value === true) {
    io.to(self.socketRoom).emit(self.jadeData.Busy.updateEvent, true);
  }
  console.log(preLog(), 'onBusyChange', data.value.value);
};
module.prototype.onDoneChange = function(data) {
  var self = mi5Manual; // since it is called before getModuleData

  if (data.value.value === true) {
    io.to(self.socketRoom).emit(self.jadeData.Done.updateEvent, true);
  }
  console.log(preLog(), 'onDoneChange', data.value.value);
};
module.prototype.onExecuteChange = function(data) {
  var self = mi5Manual; // since it is called before getModuleData

  if (data.value.value === true) {
    io.to(self.socketRoom).emit(self.jadeData.Execute.updateEvent, true);
    io.to(self.socketRoom).emit('reloadPageManual', 0);
    // Navbar
    io.emit('manualRequired', true);
  }
  if (data.value.value === false) {
    // task fully finished
    self.setValue(self.jadeData.Done.nodeId, false, function() {
    });
    io.emit('manualRequired', true);
    io.to(self.socketRoom).emit('reloadPageManual', 0);
  }
  console.log(preLog(), 'onExecuteChange', data.value.value);
};
module.prototype.onReadyChange = function(data) {
  if (data.value.value === true) {
    console.log(preLog(), 'onReadyChange', data.value.value);
  }
};

// /////////////////////////////////////////////////////////////////
// Soket

module.prototype.ioRegister = function(socket) {
  var self = mi5Manual; // this would be socket.io io.on('connection')

  _.bindAll(self, 'socketUserIsBusy', 'socketUserIsDone'); // reset scope

  assert(typeof socket !== 'undefined');

  socket.on('userIsBusy', self.socketUserIsBusy);
  socket.on('userIsDone', self.socketUserIsDone);

  console.log(preLog(), 'OK - Maintenance Module - event listeners registered');
}

module.prototype.socketUserIsBusy = function() {
  var self = this;
  console.log(preLog(), 'OK - User is busy');
  self.setValue(self.jadeData.Busy.nodeId, true, function() {
  });
  self.setValue(self.jadeData.Ready.nodeId, false, function() {
  });

}

module.prototype.socketUserIsDone = function() {
  var self = this;
  self.setValue(self.jadeData.Done.nodeId, true, function(err) {
    console.log(preLog(), 'OK - User is done');
  });
  self.setValue(self.jadeData.Busy.nodeId, false, function(err) {
    console.log(preLog(), 'OK - waiting for PT to set execute = false');
  });
}

// /////////////////////////////////////////////////////////////////
// Backend

/**
 * monitor a list of items and assign a callback event
 * 
 * @param itemArray
 *          <array> [{nodeId: '', callback: cbFunction}]
 * @returns <boolean>
 */
module.prototype.monitorItems = function(itemArray) {
  var self = this;

  assert(_.isArray(itemArray));

  itemArray.forEach(function(item) {
    mI = self.opc.mi5Monitor(item.nodeId);
    mI.on('changed', item.callback);
  });
  return true;
}

/**
 * set a key:value object based on a basenode
 * 
 * @async
 * @param baseNode
 *          <string> 'MI5.Module2402Manual'
 * @param dataObject
 *          <object> {Execute: true}
 * @param callback
 *          <function>
 */
module.prototype.setObject = function(baseNode, dataObject, callback) {
  var self = this;

  assert(typeof baseNode === "string");
  assert(_.isObject(dataObject));

  var Mi5ManualModule = require('./../models/simpleDataTypeMapping.js').Mi5ManualModule;
  self.opc.mi5WriteObject(baseNode, dataObject, Mi5ManualModule, callback);
}

/**
 * set a nodeid value pair (using jadeDate this is useful)
 * 
 * @uses this.setObject()
 * @param nodeId
 *          <string> 'MI5.Module2402Manual.Execute'
 * @param value
 *          <mixed>
 * @param callback
 *          <function>
 */
module.prototype.setValue = function(nodeId, value, callback) {
  var self = this;

  assert(typeof nodeId === "string");
  assert(typeof callback === 'function');

  var baseNode = opcH.cutLastElement(nodeId);
  var lastElement = opcH.getLastElement(nodeId);

  var dataObject = {};
  dataObject[lastElement] = value;

  self.setObject(baseNode, dataObject, callback);
}

/**
 * dummyStruct
 * 
 * @return <object>
 */
module.prototype.structManualModuleObjectBlank = function() {
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
module.prototype.structManualModule = function(baseNode) {
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
module.prototype.structManuelModuleParameter = function(baseNode) {
  var nodes = [ 'ID', 'Name', 'StringValue', 'Unit', 'Value' ];
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });
  return nodes;
}

/**
 * Dummy function, for no callback;
 */
module.prototype.dummyCallback = function(err) {
  console.log(err);
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
