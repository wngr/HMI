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

/*
 * Config Production List
 */
var NumberOfParameters = 1; // 5 // only works with 2 !!!!!! TODO
var NumberOfSkills = 1; // 50 // only works with 5 !!!!!!!!! TODO
var NumberOfTasks = 30; // 30 (Production List Size)

/**
 * Get all Tasks
 * 
 * @async
 * @function callback(err, tasksArray)
 */
function getAllTasks(callback) {
  taskIdArray = [];
  for (var i = 0; i <= NumberOfTasks; i++) {
    taskIdArray.push(i);
  }

  getTasks(taskIdArray, callback);
}
exports.getAllTasks = getAllTasks;

/**
 * Get selected Tasks
 * 
 * @async
 * @param taskIdArray
 * @function callback(err, tasksArray)
 */
function getTasks(taskIdArray, callback) {
  var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUATask);

  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    tasksArray = [];
    // Read Base
    taskIdArray.forEach(function(id) {
      var baseNodeTask = structTask('MI5.ProductionList[' + id + '].');

      opc.mi5ReadArray(baseNodeTask, function(err, data) {
        // Convert opc.Mi5 object to jadeData
        var mi5Object = opcH.mapMi5ArrayToObject(data, structTaskObjectBlank());

        // only push if no dummy
        if (mi5Object.Dummy.value === false) {
          tasksArray.push(mi5Object);
        }

        // Callback on very last element
        if (id == _.last(taskIdArray)) {
          callback(err, tasksArray); // final callback
          opc.disconnect();
        }
      }); // end opc.mi5ReadArray
    }); // end for
  }); // end opc.initialize()

}
exports.getTasks = getTasks;

/**
 * Get Blank Task-Struct
 * 
 * @returns {___anonymous278_400}
 */
function structTaskObjectBlank() {
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
  // Skills
  _123n(0, NumberOfSkills).forEach(function(i) {
    var skillDummy = {
      AssignedModuleID : '',
      AssignedModuleName : '',
      AssignedModulePosition : '',
      Dummy : '',
      ID : '',
      Name : '',
      UserParameter : []
    };

    // UserParameters
    _123n(0, NumberOfParameters).forEach(function(j) {
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
    }); // end forEach UserParameters

    taskDummy.Skill.push(skillDummy);
  }); // end forEach Skills

  return taskDummy;
}

/**
 * Adds Parameters to a basenode :ProductionList[0].YYYYYYYYYY
 * 
 * @param baseNode
 *          string
 * @return array
 */
function structTask(baseNode) {
  var numberOfSkills = NumberOfSkills; // 50
  var nodes = [ 'Dummy', 'Name', 'RecipeID', 'State', 'TaskID', 'Timestamp' ];
  // Add all 50 Skills
  for (var i = 0; i <= numberOfSkills; i++) {
    var temp = structTaskSkill('Skill[' + i + '].');
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
 * Adds nodes to Skill[x].YYYYYYYYYYY
 * 
 * @param baseNode
 *          <string>
 * @return array
 */
function structTaskSkill(baseNode) {
  var numberOfParameters = NumberOfParameters; // 5
  var nodes = [ 'AssignedModuleID', 'AssignedModuleName', 'AssignedModulePosition', 'Dummy', 'ID',
      'Name' ];
  // Add all 5 Parameters
  for (var i = 0; i <= numberOfParameters; i++) {
    var temp = structTaskSkillParameter('UserParameter[' + i + '].');
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
function structTaskSkillParameter(baseNode) {
  var nodes = [ 'Dummy', 'ID', 'Name', 'Unit', 'Required', 'Defualt', 'MinValue', 'MaxValue',
      'Value' ];
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
