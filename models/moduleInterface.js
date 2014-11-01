/**
 * ModuleInterface
 * 
 * Facilitate the opcua access
 */

exports.server = function(endpointUrl) {
  var opcuaInstance = require('./../models/opcuaInstance').server(endpointUrl);

  opcuaInstance.on('ready', function() {
    return opcuaInstance;
  });

  opcuaInstance.initialize(); // when all callbare registered - initializeacks
};

exports.module = function(moduleName) {
  var jadeData = {};

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