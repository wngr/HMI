/**
 * ModuleInterface
 * 
 * Facilitate the opcua access
 */
var opcuaHelper = require('./opcuaHelper');

var pEndpointUrl, pModule, pSkill; // p for property

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
  var lastSkill = 15;
  var opcuaInstance = require('./../models/opcuaInstance').server(pEndpointUrl);
  var baseNode = 'MI5.' + pModule + '.Output.SkillOutput';
  var skills = new Array;

  opcuaInstance.on('ready', function() {
    for (var i = 0; i <= lastSkill; i++) {
      if (i == lastSkill) {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArraySkillOutputSingle(baseNode, i), function(
            err, nodes, results) {
          pushSkillResult(err, nodes, results);
          callback(skills);
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

/***************************************************************************************************
 * Parameters
 */
function getParameters(callback) {
  if (!pSkill) {
    console.log('ERR - No Skill is set!');
  }
  var lastParameter = 5;
  var opcuaInstance = require('./../models/opcuaInstance').server(pEndpointUrl);
  var baseNode = 'MI5.' + pModule + '.Output.SkillOutput.SkillOutput' + pSkill + '.ParameterOutput';
  var parameters = new Array;

  opcuaInstance.on('ready', function() {
    for (var i = 0; i <= lastParameter; i++) {
      if (i == lastParameter) {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArrayParameterOutputSingle(baseNode, i),
            function(err, nodes, results) {
              pushParameterResult(err, nodes, results);
              callback(parameters);
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
      callback(module);
    });
  });

  opcuaInstance.initialize();
}
exports.getModule = getModule;

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