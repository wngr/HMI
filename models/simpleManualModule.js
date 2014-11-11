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
 * Config Production List
 */
var NumberOfParameters = 5; // 5

/**
 * @async
 * @function callback(err, mi5Object, rawData)
 */
function getModuleData(handModuleID, callback) {
  assert(typeof handModuleID === "number");
  assert(typeof callback === "function");

  var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAHandModule);

  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    var baseNodeTask = structManualModule('MI5.Module' + handModuleID + 'Manual.');
    opc.mi5ReadArray(baseNodeTask, function(err, data) {
      var mi5Object = opcH.mapMi5ArrayToObject(data, structManualModuleObjectBlank());

      callback(err, mi5Object, data); // final callback
      opc.disconnect();
    }); // end opc.mi5ReadArray
  }); // end opc.initialize()

}
exports.getModuleData = getModuleData;

function subscribeHandModule(rawData, callback) {
  assert(_.isArray(rawData));
  assert(typeof callback === "function");
}

/**
 * @returns {___anonymous278_400}
 */
function structManualModuleObjectBlank() {
  // Base
  var handModuleDummy = {
    Busy : '',
    Done : '',
    Error : '',
    ErrorID : '',
    Parameter : [],
    Ready : '',
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
  var nodes = [ 'Busy', 'Done', 'Error', 'ErrorID', 'Ready', 'SkillDescription', 'SkillID',
      'TaskID' ];
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
