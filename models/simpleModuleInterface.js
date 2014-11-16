/**
 * Simple Module Interface
 * 
 * uses no-array architecture: Parameter[0] becomes: Parameter.Parameter0.
 */
var jadeH = require('./simpleJadeHelper');
var opcH = require('./simpleOpcuaHelperModuleInterface');
var _123n = opcH._123n;

var NumberOfSkillInputs = 2; // 15 max, but only 2 implemented!
var NumberOfParameterInputs = 1;

/**
 * Get Inputs
 * 
 * @async
 * @param inputIdArray
 * @function callback(err, tasksArray)
 */
function getInput(callback) {
  var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAInputModule);

  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    var baseNodeTask = structInput('MI5.Module2501.Input.');

    opc.mi5ReadArray(baseNodeTask, function(err, data) {
      // console.log(err, data);
      // Convert opc.Mi5 object to jadeData
      var mi5Object = opcH.mapMi5ArrayToObject(data, structInputObjectBlank());

      opc.disconnect();
      callback(err, mi5Object);

    }); // end opc.mi5ReadArray
  }); // end opc.initialize()

}
exports.getInput = getInput;

/**
 * Get Blank InputStruct
 * 
 * @returns <object>
 */
function structInputObjectBlank() {
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
  _123n(0, NumberOfSkillInputs).forEach(function(i) {
    var skillInputDummy = {
      Execute : '',
      ParameterInput : []
    };

    // UserParameters
    _123n(0, NumberOfParameterInputs).forEach(function(j) {
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
exports.structInputObjectBlank = structInputObjectBlank;

/**
 * Adds SkillInput to a basenode (no-array-architecture)
 * 
 * @param baseNode
 *          string
 * @return array
 */
function structInput(baseNode) {
  var nodes = [ 'ConnectionTestInput', 'EmergencyStop', 'Mode', 'PositionInput', 'Watchbit' ];
  // Add all 50 Skills
  for (var i = 0; i <= NumberOfSkillInputs; i++) {
    var temp = structSkillInput('SkillInput.SkillInput' + i + '.');
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
exports.structInput = structInput;

/**
 * Adds ParameterInput to a basenode (no-array-architecture)
 * 
 * @param baseNode
 *          <string>
 * @return array
 */
function structSkillInput(baseNode) {
  var nodes = [ 'Execute' ];
  // Add all 5 Parameters
  for (var i = 0; i <= NumberOfParameterInputs; i++) {
    var temp = structParameterInput('ParameterInput.ParameterInput' + i + '.');
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
function structParameterInput(baseNode) {
  var nodes = [ 'StringValue', 'Value' ];
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });
  return nodes;
}