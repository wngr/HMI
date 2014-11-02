/**
 * ModuleInterface
 * 
 * Facilitate the opcua access
 */
var opcuaHelper = require('./opcuaHelper');

var pEndpointUrl, pModule, pSkill; // p for property

var pLastParameter = 5;
var pLastSkill = 15;

/***************************************************************************************************
 * Setup Module Interface for Job
 */
function setEndpointUrl(endpointUrl) {
  pEndpointUrl = endpointUrl;
}
exports.setEndpointUrl = setEndpointUrl;

function setModule(module) {
  pModule = module;
}
exports.setModule = setModule;

function setSkill(skill) {
  pSkill = skill;
}
exports.setSkill = setSkill;

/***************************************************************************************************
 * Skills
 */
function getSkills(callback) {
  var opcuaInstance = require('./../models/opcuaInstance').server(pEndpointUrl);
  var baseNode = 'MI5.' + pModule + '.Output.SkillOutput';
  var skills = new Array;

  opcuaInstance.on('ready', function() {
    for (var i = 0; i <= pLastSkill; i++) {
      if (i == pLastSkill) {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArraySkillOutputSingle(baseNode, i), function(
            err, nodes, results) {
          pushSkillResult(err, nodes, results);

          opcuaInstance.disconnect();
          callback(skills); // final callback
        });
      } else {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArraySkillOutputSingle(baseNode, i),
            pushSkillResult);
      }
    }
  });

  function pushSkillResult(err, nodes, results) {
    skills.push(opcuaHelper.formatResultToObject(err, nodes, results));
  }

  opcuaInstance.initialize();
}
exports.getSkills = getSkills;

function getSkillsWithParameters(callback) {
  var opcuaInstance = require('./../models/opcuaInstance').server(pEndpointUrl);
  var baseNode = 'MI5.' + pModule + '.Output.SkillOutput';
  var skills = new Array;
  var skillCounter = 0;

  opcuaInstance.on('ready', function() {
    for (skillCounter; skillCounter <= pLastSkill; skillCounter++) {
      if (skillCounter == pLastSkill) {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArraySkillOutputSingle(baseNode, skillCounter),
            function(err, nodes, results) {
              pushSkillResult(err, nodes, results, function() {

                opcuaInstance.disconnect();
                callback(skills); // final callback
              });
            });
      } else {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArraySkillOutputSingle(baseNode, skillCounter),
            pushSkillResult);
      }
    }
  });

  function pushSkillResult(err, nodes, results, callback) {
    var resultObject = opcuaHelper.formatResultToObject(err, nodes, results);

    addParameters(function(output) {
      resultObject.parameters = output;
      skills.push(resultObject);
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  function addParameters(callback) {
    var parameters = new Array;
    var parameterBaseNode = baseNode + '.SkillOutput.' + skillCounter + 'ParameterOutput';

    for (var i = 0; i <= pLastParameter; i++) {
      if (i == pLastParameter) {
        opcuaInstance.readArrayCB(opcuaInstance
            .nodeArrayParameterOutputSingle(parameterBaseNode, i), function(err, nodes, results) {
          pushParameterResult(err, nodes, results);
          callback(parameters);
        });
      } else {
        opcuaInstance.readArrayCB(opcuaInstance
            .nodeArrayParameterOutputSingle(parameterBaseNode, i), pushParameterResult);
      }
    }

    function pushParameterResult(err, nodes, results) {
      parameters.push(opcuaHelper.formatResultToObject(err, nodes, results));
    }
  }

  opcuaInstance.initialize();
}
exports.getSkillsWithParameters = getSkillsWithParameters;

/***************************************************************************************************
 * Parameters
 */
function getParameters(callback) {
  if (!pSkill) {
    console.log('ERR - No Skill is set!');
  }
  var opcuaInstance = require('./../models/opcuaInstance').server(pEndpointUrl);
  var baseNode = 'MI5.' + pModule + '.Output.SkillOutput.SkillOutput' + pSkill + '.ParameterOutput';
  var parameters = new Array;

  opcuaInstance.on('ready', function() {
    for (var i = 0; i <= pLastParameter; i++) {
      if (i == pLastParameter) {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArrayParameterOutputSingle(baseNode, i),
            function(err, nodes, results) {
              pushParameterResult(err, nodes, results);

              opcuaInstance.disconnect();
              callback(parameters); // final callback
            });
      } else {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArrayParameterOutputSingle(baseNode, i),
            pushParameterResult);
      }
    }
  });

  function pushParameterResult(err, nodes, results) {
    parameters.push(opcuaHelper.formatResultToObject(err, nodes, results));
  }

  opcuaInstance.initialize();
}
exports.getParameters = getParameters;

/***************************************************************************************************
 * Module
 */
function getModule(callback) {
  var opcuaInstance = require('./../models/opcuaInstance').server(pEndpointUrl);
  var baseNode = 'MI5.' + pModule + '.Output';
  var module = new Array;

  opcuaInstance.on('ready', function() {
    opcuaInstance.readArrayCB(opcuaInstance.nodeArrayModuleOutput(baseNode), function(err, nodes,
        results) {
      module.push(opcuaHelper.formatResultToObject(err, nodes, results));

      opcuaInstance.disconnect();
      callback(module);
    });
  });

  opcuaInstance.initialize();
}
exports.getModule = getModule;

function getCompleteModuleData(callback) {
  var moduleData = new Object();
  moduleData.skills = new Array();

  getModule(function(output) {
    moduleData.module = output;

    getSkillsWithParameters(function(output) {
      moduleData.skills.push(output);

      callback(moduleData); // final callback
    });
  });
}
exports.getCompleteModuleData = getCompleteModuleData;

/***************************************************************************************************
 * (deprecated?) for References
 */
exports.readAndSubscribe = function(moduleName, endpointUrl) {
  var opcuaInstance = require('./../models/opcuaInstance').server(endpointUrl);
  var jadeData = {};

  function readModule(callback) {

    opcuaInstance.on('ready', function() {
      opcuaInstance.readArray(opcuaInstance.nodeArraySkillOutputSingle(
          'MI5.Module1101.Output.SkillOutput', 0));
    });

    callback(null);
  }

  async.series([ readModule ]);

  /*
   * ReadArray
   */
  opcuaInstance.on('readArrayFinished', function(data) {
    /*
     * Format the nodeValueArray to SkillContainer
     */
    var moduleData = {
      moduleData : {
        name : 'Halloho',
        skills : [ opcuaInstance.formatNodeValueArrayToSkillContainerArray(data) ]
      }
    };
    jadeData = _.extend(jadeData, moduleData);

    /*
     * When the array is read, subscribe to all the nodes, that belong to that skill and register
     * event emitters.
     */
    opcuaInstance.subscribe();
    data.forEach(function(entry) {
      var myNode = opcuaInstance.monitor('ns=4;s=' + entry.nodeId);
      myNode.on('changed', function(data) {
        console.log('changed:', entry.nodeId, data);
        IO.emit(entry.updateEvent, data);
      });

      console.log('added monitord item on:', entry.nodeId);
    });

    console.log('render');
    console.log(JSON.stringify(jadeData, null, 1));
    res.render('bootstrap/testModuleView', jadeData);
  });

  opcuaInstance.on('ready', function() {
    opcuaInstance.readArray(opcuaInstance.nodeArraySkillOutputSingle(
        'MI5.Module1101.Output.SkillOutput', 0));
  });

  opcuaInstance.initialize(); // when all callbare registered - initializeacks
}