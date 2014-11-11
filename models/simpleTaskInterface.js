/**
 * RecipeInterface
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
var jadeH = require('./simpleJadeHelper');
var opcH = require('./simpleOpcuaHelper');

/**
 * Get Blank Task-Struct
 * 
 * @returns {___anonymous278_400}
 */
function getBlankTask() {
  // Base
  var taskDummy = {
    Dummy : '',
    Name : '',
    RecipeID : '',
    Skill : [],
    State : '',
    TaskID : '',
    Timestamp : ''
  };
  // Add Skills
  _123n(0, 5).forEach(function(i) {
    var skillDummy = {
      AssignedModuleID : '',
      AssignedModuleName : '',
      AssignedModulePosition : '',
      Dummy : '',
      ID : '',
      Name : '',
      UserParameter : []
    };
    // Add UserParameters
    _123n(0, 2).forEach(function(j) {
      var parameterDummy = {
        Dummy : '',
        ID : '',
        Name : '',
        Unit : '',
        Required : '',
        Default : '',
        MinValue : '',
        MaxValue : '',
        Value : ''
      };
      skillDummy.UserParameter.push(parameterDummy);
    });
    taskDummy.Skill.push(skillDummy);
  });
  return taskDummy;
}
exports.getBlankTask = getBlankTask;

/**
 * Get recipes
 * 
 * @async
 * @param taskIdArray
 * @function callback(err, recipesArray)
 */
function getTasks(taskIdArray, callback) {
  var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUATask);

  opc
      .initialize(function(err) {
        if (err) {
          console.log(err);
          callback(err);
          return 0;
        }

        tasksArray = [];
        // Read Base
        taskIdArray
            .forEach(function(id) {
              var baseNodeTask = opc._structTaskBase('MI5.ProductionList[' + id + '].');
              // console.log(baseNodeTask);
              opc
                  .mi5ReadArray(
                      baseNodeTask,
                      function(err, data) {
                        var dummyTask = getBlankTask();
                        // console.log(dummyTask);

                        data
                            .forEach(function(entry) {
                              var splitNodeId = opcH.splitNodeId(entry.nodeId); // [0]: MI5; [1]:
                              // ProductionList[x]

                              if (splitNodeId.length == 3) {
                                // splitNodeId[2] // Name
                                dummyTask[splitNodeId[2]] = entry
                              }
                              if (splitNodeId.length == 4) {
                                // splitNodeId[2] // Skill[x]
                                // splitNodeId[3] // Name
                                skillArrayName = opcH.stripArray(splitNodeId[2]);
                                skillArrayElement = opcH.detectArrayElement(splitNodeId[2]);
                                dummyTask[skillArrayName][skillArrayElement][splitNodeId[3]] = entry;
                              }
                              if (splitNodeId.length == 5) {
                                // splitNodeId[2] // Skill[x]
                                // splitNodeId[3] // UserParameter[y]
                                // splitNodeId[4] // Name
                                skillArrayName = opcH.stripArray(splitNodeId[2]);
                                skillArrayElement = opcH.detectArrayElement(splitNodeId[2]);

                                parameterArrayName = opcH.stripArray(splitNodeId[3]);
                                parameterArrayElement = opcH.detectArrayElement(splitNodeId[3]);

                                dummyTask[skillArrayName][skillArrayElement][parameterArrayName][parameterArrayElement][splitNodeId[4]] = entry;
                              }
                            });

                        // Callback on very last element
                        if (id == _.last(taskIdArray)) {
                          callback(err, dummyTask); // final callback
                          opc.disconnect();
                        }
                      }); // end opc.mi5ReadArray
            }); // end for
      }); // end opc.initialize()

}
exports.getTasks = getTasks;

/*
 * 
 */
function _NodeArray(nodeArray, callback) {

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
