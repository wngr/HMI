/**
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
var jadeH = require('./simpleJadeHelper');
var opcH = require('./simpleOpcuaHelper');
var assert = require('assert');

/*
 * RawData object for listeners
 */
var manualModuleRawData = undefined;
var manualModuleJadeData = undefined;

/*
 * Config Production List
 */
var NumberOfParameters = 5; // 5

/*
 * persistent connection for subscriptions
 */
var opcConnection = require('./../models/simpleOpcua').server(
    CONFIG.OPCUAHandModule);

/**
 * In IO.on('connection')
 * 
 * @async
 * @param socket
 */
function start(socket) {
  assert(typeof socket !== "undefined");

  getModuleData(function(err, mi5Data, rawData) {
    if (err) {
      console.log(err);
      return 0;
    }

    subscribeModuleData();
    registerListeners(socket);

  });
}
exports.start = start;

function _initializeManualModule(callback) {

}

/**
 * @async
 * @function callback(err, mi5Object, rawData)
 */
function getModuleData(callback) {
  assert(typeof callback === "function");

  opcConnection.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }
    console.log('OK? - getModuleData'); // TODO: it seems, as if this is always
    // called, PERFORMANCE?

    _registerEventListeners();

    var baseNodeTask = structManualModule('MI5.Module' + CONFIG.MANUALMODULEID
        + 'Manual.');
    opcConnection.mi5ReadArray(baseNodeTask, function(err, data) {
      var mi5Object = opcH.mapMi5ArrayToObject(data,
          structManualModuleObjectBlank());

      manualModuleRawData = data;
      manualModuleJadeData = mi5Object;
      callback(err, mi5Object, data); // final callback
    }); // end opc.mi5ReadArray
  }); // end opc.initialize()

}
exports.getModuleData = getModuleData;

function startTask() {
}

/**
 * 
 * @param rawData
 * @param callback
 */
function subscribeModuleData() {
  assert(_.isArray(manualModuleRawData));
  assert(typeof opcConnection !== "undefined");

  /*
   * Subscribe to everything
   */
  opcConnection.mi5Subscribe();
  manualModuleRawData.forEach(function(entry) {
    var myNode = opcConnection.mi5Monitor(entry.nodeId);
    myNode.on('changed', function(data) {
      // Check, that nothing happens, if no real change

      // if (entry.value != data.value.value) {

      console.log('changed:', entry.nodeId);
      // Send data to browser
      IO.emit(entry.updateEvent, data);

      // Handle Server Events for state machine
      handleServerEvents(entry.nodeId, data);
      // }
    });
  });
  console
      .log('OK - All Subscrptions and monitored items for Manual Module created');
  return 0;
}
exports.subscribeModuleData = subscribeModuleData;

/**
 * 
 * @param socket
 */
function registerListeners(socket) {
  // console.log(manualModuleRawData);
  manualModuleRawData.forEach(function(item) {
    socket.on(item.submitEvent, function(eventData) {
      console.log('OK - Hand Module - User Event :', eventData);

      handleUserEvents(eventData);
    });
  });
  console.log('OK - All Event Listeners for Manual Module registered');
}
exports.registerListeners = registerListeners;

/**
 * Implement Hand Module Logic for User Side
 * 
 * @param eventData
 */
function handleUserEvents(eventData) {
  assert(_.isObject(eventData));

  var nodeId = eventData.nodeId;
  var value = eventData.value;

  var baseNode = opcH.cutLastElement(nodeId);
  var parameter = opcH.getLastElement(nodeId);

  // Write to OPC
  if (parameter === 'Busy') {
    setValue(baseNode, {
      Busy : true
    });
    console.log('HandModule - User starts - Busy: true');
  }
  if (parameter === 'Done') {
    setValue(baseNode, {
      Busy : false,
      Done : true
    });
    console.log('HandModule - User is finished - Busy: false, Done: true');
  }
}
exports.handleUserEvents = handleUserEvents;

/**
 * Implement Hand Module Logic for Server Side
 * 
 * @param eventData
 */
function handleServerEvents(nodeId, eventData) {
  assert(typeof nodeId === "string");
  assert(_.isObject(eventData));

  var baseNode = opcH.cutLastElement(nodeId);
  var parameter = opcH.getLastElement(nodeId);
  var value = eventData.value.value;

  // Process Tool recognizes, that this task is finished
  if (parameter === 'Execute' && value === false) {
    setValue(baseNode, {
      Done : false,
      Ready : true
    });
    console.log('HandModule - Task fully finished - Done: false, Ready: true');
    // _emitEvent('taskIsFinished', 1);
    IO.emit('taskFullyFinished', 1);
  }

  // When we get an Execute from the PT, we are not longer ready
  if (parameter === 'Execute' && value === true) {
    setValue(baseNode, {
      Ready : false
    });
    console.log('HandModule - Ready: false');
  }

}

/**
 * 
 * @param nodeId
 * @param value
 */
function setValue(baseNode, dataObject) {
  assert(typeof baseNode === "string");
  assert(_.isObject(dataObject));

  var Mi5ManualModule = require('./../models/simpleDataTypeMapping.js').Mi5ManualModule;
  opcConnection.mi5WriteObject(baseNode, dataObject, Mi5ManualModule, function(
      err) {
    console.log('Mi5ManualModule written - no error feedback possible');
  });
}
exports.setValue = setValue;

/**
 * inner event Handling for manual Module
 * 
 * redirects emitEvents to opcConnection
 */
function _emitEvent(eventName, value) {
  opcConnection.emit(eventName, value);
}

/**
 * inner event Handling manual Module
 * 
 * listener
 * 
 * @async
 */
function _listenEvent(eventName, callback) {
  assert(_.isString(eventName));
  assert(typeof callback === 'function');

  opcConnection.on(eventName, callback);
}

function _registerEventListeners() {
  _listenEvent('taskIsFinished', function(data) {
    console.log('task is fully finished - listened - data:', data);
  })
}

function getRawData() {
  return manualModuleRawData;
}
exports.getRawData = getRawData;

function getJadeData() {
  return manualModuleJadeData;
}
exports.getJadeData = getJadeData;

function disconnect() {
  if (typeof opcConnection !== 'undefined') {
    opcConnection.disconnect();
    console.log('simpleManualModule - opcConnection.disconnect()');
  } else {
    console.log('Cannot disconnect opcConnection because its not defined');
  }
}
exports.disconnect = disconnect;

/**
 * @returns {___anonymous278_400}
 */
function structManualModuleObjectBlank() {
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
  _123n(0, NumberOfParameters).forEach(function(i) {

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
function structManualModule(baseNode) {
  var numberOfParameters = NumberOfParameters; // 5
  var nodes = [ 'Execute', 'Busy', 'Done', 'Error', 'ErrorID', 'Ready',
      'SkillDescription', 'SkillID', 'TaskID' ];
  // Add all 6 Parameters
  for (var i = 0; i <= numberOfParameters; i++) {
    var temp = structManuelModuleParameter('Parameter[' + i + '].');
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
function structManuelModuleParameter(baseNode) {
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
exports._123n = _123n;
