/**
 * Maintenance Module in Class-Architecture
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-020
 */
var jadeH = require('./simpleJadeHelper');
var opcH = require('./simpleOpcuaHelperModuleInterface');
var _123n = opcH._123n;
var assert = require('assert');

/**
 * InputModule Class
 * 
 * old name module, for not changing everything
 * 
 * @returns
 */
module = function() {
  this.NumberOfSkillInputs = 2; // 15 max, but only 2 implemented!
  this.NumberOfParameterInputs = 1;

  this.NumberOfSkillOutputs = 2; // 15 orig, but only 2 implemented!
  this.NumberOfParameterOutputs = 1; // 5 orig
  this.NumberOfStateValues = 5; // 10 orig

  this.isInitialized = false;
  this.rawData = undefined;
  this.jadeData = {
    input : {},
    output : {}
  };

  this.socketRoom = 'input-module';
  this.ModuleId = 2501;

  this.opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAInputModule);
  console.log('endpoint', CONFIG.OPCUAInputModule);
};
exports.newInputModule = new module();

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
    console.log('OK - Maintenance Module is ready');
  });
}

module.prototype.onBusyChange = function(data) {
  var self = mi5Manual; // since it is called before getModuleData

  if (data.value.value === true) {
    io.to(self.socketRoom).emit(self.jadeData.Busy.updateEvent, true);
  }
  console.log('onBusyChange', data.value.value);
};
module.prototype.onDoneChange = function(data) {
  var self = mi5Manual; // since it is called before getModuleData

  if (data.value.value === true) {
    io.to(self.socketRoom).emit(self.jadeData.Done.updateEvent, true);
  }
  console.log('onDoneChange', data.value.value);
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
  console.log('onExecuteChange', data.value.value);
};
module.prototype.onReadyChange = function(data) {
  if (data.value.value === true) {
    console.log('onReadyChange', data.value.value);
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

  console.log('OK - Maintenance Module - event listeners registered');
}

module.prototype.socketUserIsBusy = function() {
  var self = this;
  console.log('OK - User is busy');
  self.setValue(self.jadeData.Busy.nodeId, true, function() {
  });
  self.setValue(self.jadeData.Ready.nodeId, false, function() {
  });

}

module.prototype.socketUserIsDone = function() {
  var self = this;
  self.setValue(self.jadeData.Done.nodeId, true, function(err) {
    console.log('OK - User is done');
  });
  self.setValue(self.jadeData.Busy.nodeId, false, function(err) {
    console.log('OK - waiting for PT to set execute = false');
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
};

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
};

// ///////////////////////////////////////////////////////////////////////////////////////////
// Module Interface Stuff
/**
 * Get Inputs
 * 
 * @async
 * @param inputIdArray
 * @function callback(err, tasksArray)
 */
module.prototype.getInput = function(callback) {
  var self = this;

  assert(self.isInitialized, 'opc is not initialized call self.initialize() *async* first');
  assert(typeof callback === 'function');

  var baseNodeTask = self.structInput('MI5.Module' + self.ModuleId + '.Input.');

  self.opc.mi5ReadArray(baseNodeTask, function(err, data) {
    // console.log(err, data);
    // Convert opc.Mi5 object to jadeData
    var mi5Object = opcH.mapMi5ArrayToObject(data, self.structInputObjectBlank());

    self.jadeData.input = mi5Object;
    callback(err, mi5Object);
  }); // end opc.mi5ReadArray

};

/**
 * Get Outputs
 * 
 * @async
 * @param callback
 *          <function>
 * @function callback(err, tasksArray)
 */
module.prototype.getOutput = function(callback) {
  var self = this;

  assert(self.isInitialized, 'opc is not initialized call self.initialize() *async* first');
  assert(typeof callback === 'function');

  // Generate Array to read
  var baseNodeStruct = self.structOutput('MI5.Module' + self.ModuleId + '.Output.');
  // console.log(baseNodeStruct);

  self.opc.mi5ReadArray(baseNodeStruct, function(err, data) {
    // console.log(err, data);
    // Convert opc.Mi5 object to jadeData
    var mi5Object = opcH.mapMi5ArrayToObject(data, self.structOutputObjectBlank());

    self.jadeData.output = mi5Object;
    callback(err, mi5Object);
  }); // end opc.mi5ReadArray
};

// ///////////////////////////////////////////////////////////////////////////////////////////
// Input
/**
 * Get Blank InputStruct
 * 
 * @returns <object>
 */
module.prototype.structInputObjectBlank = function() {
  var self = this;

  // Base
  var inputDummy = {
    ConnectionTestInput : '',
    EmergencyStop : '',
    Mode : '',
    PositionInput : '',
    SkillInput : [],
    Watchbit : ''
  };
  // Skills
  _123n(0, self.NumberOfSkillInputs).forEach(function(i) {
    var skillInputDummy = {
      Execute : '',
      ParameterInput : []
    };

    // UserParameters
    _123n(0, self.NumberOfParameterInputs).forEach(function(j) {
      var parameterDummy = {
        Value : '',
        StringValue : ''
      };
      skillInputDummy.ParameterInput.push(parameterDummy);
    }); // end forEach UserParameters

    inputDummy.SkillInput.push(skillInputDummy);
  }); // end forEach Skills

  return inputDummy;
}

/**
 * Adds SkillInput to a basenode (no-array-architecture)
 * 
 * @param baseNode
 *          string
 * @return array
 */
module.prototype.structInput = function(baseNode) {
  var self = this;

  var nodes = [ 'ConnectionTestInput', 'EmergencyStop', 'Mode', 'PositionInput', 'Watchbit' ];
  // Add all 50 Skills
  for (var i = 0; i <= self.NumberOfSkillInputs; i++) {
    var temp = self.structSkillInput('SkillInput.SkillInput' + i + '.');
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
 * Adds ParameterInput to a basenode (no-array-architecture)
 * 
 * @param baseNode
 *          <string>
 * @return array
 */
module.prototype.structSkillInput = function(baseNode) {
  var self = this;

  var nodes = [ 'Execute' ];
  // Add all 5 Parameters
  for (var i = 0; i <= self.NumberOfParameterInputs; i++) {
    var temp = self.structParameterInput('ParameterInput.ParameterInput' + i + '.');
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
 * Adds nodes to UserParameter[x].YYYYYYYYYYY
 * 
 * @param baseNode
 *          <string>
 * @return <array>
 */
module.prototype.structParameterInput = function(baseNode) {
  var self = this;

  var nodes = [ 'StringValue', 'Value' ];
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });
  return nodes;
}

// ///////////////////////////////////////////////////////////////////////////////////////////
// Output
/**
 * Get Blank InputStruct
 * 
 * @returns <object>
 */
module.prototype.structOutputObjectBlank = function() {
  var self = this;

  // Base
  var outputDummy = {
    Connected : '',
    ConnectionTestInput : '',
    CurrentTaskDescription : '',
    Dummy : '',
    Error : '',
    ErrorDescription : '',
    ErrorID : '',
    ID : '',
    IP : '',
    Idle : '',
    Name : '',
    PosisitionOutput : '',
    PositionSensor : '',
    SkillOutput : [],
    StateValue : [],
  };
  // Skills // Dummyobject needs to be insed the loop - pass by reference issue
  // imho
  _123n(0, self.NumberOfSkillOutputs).forEach(function(i) {
    var skillOutputDummy = {
      Activated : '',
      Busy : '',
      Done : '',
      Dummy : '',
      Error : '',
      ID : '',
      Name : '',
      ParameterOutput : [],
      Ready : ''
    };

    _123n(0, self.NumberOfParameterOutputs).forEach(function(j) {
      // UserParameters
      var parameterOutputDummy = {
        Default : '',
        Dummy : '',
        ID : '',
        MaxValue : '',
        MinValue : '',
        Name : '',
        Required : '',
        Unit : ''
      };
      skillOutputDummy.ParameterOutput.push(parameterOutputDummy);
    }); // end forEach UserParameters

    outputDummy.SkillOutput.push(skillOutputDummy);
  }); // end forEach Skills

  _123n(0, self.NumberOfStateValues).forEach(function(k) {
    var stateValueDummy = {
      Description : '',
      Dummy : '',
      Name : '',
      Unit : '',
      Value : ''
    };
    outputDummy.StateValue.push(stateValueDummy);
  });
  return outputDummy;
}

/**
 * Adds SkillOutput to a basenode (no-array-architecture)
 * 
 * @param baseNode
 *          string
 * @return array
 */
module.prototype.structOutput = function(baseNode) {
  var self = this;

  var nodes = [ 'Connected', 'ConnectionTestInput', 'CurrentTaskDescription', 'Dummy', 'Error',
      'ErrorDescription', 'ErrorID', 'ID', 'IP', 'Idle', 'Name', 'PositionSensor' ];
  // Add SkillOutputs
  for (var i = 0; i <= self.NumberOfSkillOutputs; i++) {
    var temp = self.structSkillOutput('SkillOutput.SkillOutput' + i + '.');
    temp.forEach(function(item) {
      nodes.push(item);
    });
  }
  // Add StateValues
  for (var g = 0; g <= self.NumberOfStateValues; g++) {
    var temp2 = self.structStateValue('StateValue.StateValue' + g + '.');
    temp2.forEach(function(item) {
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
 * Adds SkillOutput to a basenode (no-array-architecture)
 * 
 * @param baseNode
 *          <string>
 * @return array
 */
module.prototype.structSkillOutput = function(baseNode) {
  var self = this;

  var nodes = [ 'Activated', 'Busy', 'Done', 'Dummy', 'Error', 'ID', 'Name', 'Ready' ];
  // Add all 5 Parameters
  for (var i = 0; i <= self.NumberOfParameterInputs; i++) {
    var temp = self.structParameterOutput('ParameterOutput.ParameterOutput' + i + '.');
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
 * Adds nodes to ParameterOutput.ParameterOutputX.YYY
 * 
 * @param baseNode
 *          <string>
 * @return <array>
 */
module.prototype.structParameterOutput = function(baseNode) {
  var self = this;

  var nodes = [ 'Default', 'Dummy', 'ID', 'MaxValue', 'MinValue', 'Name', 'Required', 'Unit' ];
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });
  return nodes;
}

/**
 * Adds nodes to Output.StateValue[X].YYYY
 * 
 * @param baseNode
 *          <string>
 * @return <array>
 */
module.prototype.structStateValue = function(baseNode) {
  var self = this;

  var nodes = [ 'Description', 'Dummy', 'Name', 'Unit', 'Value' ];
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });
  return nodes;
}