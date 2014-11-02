/**
 * ModuleInterface
 * 
 * Facilitate the opcua access
 */
var opcuaHelper = require('./opcuaHelper');

var client, session, subscription;
var moduleData, skillData, parameterData;
var skills = new Array;

exports.getSkills = function getSkills(endpointUrl) {
  var opcuaInstance = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');
  var baseNode = 'MI5.Module1101.Output.SkillOutput';

  opcuaInstance.on('ready', function() {
    for (var i = 0; i <= 14; i++) {
      if (i == 14) {
        opcuaInstance.readArrayCB(opcuaInstance.nodeArraySkillOutputSingle(baseNode, i), function(
            err, nodes, results) {
          pushSkillResult(err, nodes, results);
          opcuaInstance.emit('completeSkills');
        });
      }
      opcuaInstance.readArrayCB(opcuaInstance.nodeArraySkillOutputSingle(baseNode, i),
          pushSkillResult);
    }
  });

  opcuaInstance.on('completeSkills', function() {
    console.log(skills);
  });

  opcuaInstance.initialize();
}

function pushSkillResult(err, nodes, results) {
  skills.push(formatSkillResults(err, nodes, results));
}

function formatSkillResults(err, nodes, results) {
  console.log('OK - cbSkillOutput ')
  if (err) {
    console.log("ERR - read: " + err);
    console.log("statusCode: " + statusCode);
  } else {
    var returnData = opcuaHelper.concatNodesAndResults(nodes, results);
    returnData = opcuaHelper.addEventsAndIdsToResultsArray(returnData);
    returnData = opcuaHelper.addNameToResultsArray(returnData);
    returnData = opcuaHelper.formatNodeValueArrayToSkillContainerArray(returnData);
    return returnData;
  }
}

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