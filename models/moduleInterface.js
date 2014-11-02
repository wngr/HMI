/**
 * ModuleInterface
 * 
 * Facilitate the opcua access
 */

var nodeopcua = require("node-opcua"), util = require("util"), vents = require("events");

var client, session, subscription;
var moduleData, skillData, parameterData;

exports.getSession = function getSession(endpointUrl) {

  client = new nodeopcua.OPCUAClient();
  client.connect(endpointUrl, function(err) {
    if (!err) {
      client.createSession(function(err, newSession) {
        if (!err) {
          session = newSession;
          return newSession;
        } else {
          console.log('could not create session', err);
          return err;
        }
      });
    } else {
      console.log('could not connect')
    }
  });

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