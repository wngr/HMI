/**
 * Maintenance Module in Class-Architecture
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-020
 */
var jadeH = require('./simpleJadeHelper');
var opcH = require('./simpleOpcuaHelper');
var _123n = opcH._123n;
var assert = require('assert');

/**
 * module Class
 * 
 * @returns
 */
module = function() {
  this.NumberOfParameters = 1; // 5 // only works with 2 !!!!!! TODO
  this.NumberOfSkills = 1; // 50 // only works with 5 !!!!!!!!! TODO
  this.NumberOfTasks = 30; // 30 (Production List Size)

  this.isInitialized = false;
  this.singleTask = undefined;
  this.taskList = [];

  this.socketRoom = 'task-module';

  this.opc = require('./../models/simpleOpcua').server(CONFIG.OPCUATask);
  console.log(preLog(), 'endpoint', CONFIG.OPCUATask);
};
exports.newTaskInterface = new module();

function preLog() {
  return 'Task-Module:'.black.bgYellow;
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////
// Start up and initialize

module.prototype.start = function(callback) {
  var self = mi5TaskInterface;

  self.initialize(function(err) {
    if (!err) {
      console.log('TaskInterface is connected');
      self.getTaskListReduced(function(err) {
        if (!err) {
          self.subscribe();
          callback();
        }
      });
    } else {
      console.log(preLog(), err);
      callback(err);
    }
  });
}

/**
 * initialize maintenance module opcua connection
 * 
 * @param callback
 */
module.prototype.initialize = function(callback) {
  var self = this;

  assert(typeof callback === "function");

  self.opc.initialize(function(err) {
    if (err) {
      console.log(preLog(), err);
      callback(err);
      return 0;
    } else {
      self.isInitialized = true;

      // Create a subscription
      self.opc.mi5Subscribe();
      callback(err);
    }
  });
};

// ///////////////////////////////////////////////////////////////////////////////////////////////////
// Data Handling
/**
 * Get single Task
 * 
 * @param callback
 */
module.prototype.getSingleTask = function(id, callback) {
  var self = this;

  assert(self.isInitialized, 'opc is not initialized call self.initialize() *async* first');
  assert(typeof callback === "function", 'callback must be a function');

  var baseNodeTask = self.structTask('MI5.ProductionList[' + id + '].');

  self.opc.mi5ReadArray(baseNodeTask, function(err, data) {
    if (err) {
      console.log(err.red);
      callback(err);
      return 0;
    }

    // Convert opc.Mi5 object to jadeData
    var mi5Object = opcH.mapMi5ArrayToObject(data, self.structTaskObjectBlank());

    self.singleTask = mi5Object;
    callback();
  }); // end self.opc.mi5ReadArray
};

/**
 * Get all tasks (reduced) (no skills)
 * 
 * dummy true and false
 * 
 * @param callback
 */
module.prototype.getTaskListReduced = function(callback) {
  var self = this;

  assert(self.isInitialized, 'opc is not initialized call self.initialize() *async* first');
  assert(typeof callback === "function", 'callback must be a function');

  var taskList = []

  _123n(0, self.NumberOfTasks).forEach(function(id) {
    var baseNode = self.structTaskReduced('MI5.ProductionList[' + id + '].');
    self.opc.mi5ReadArray(baseNode, function(err, data) {
      if (err) {
        console.log(err.red);
        callback(err);
        return 0;
      }

      // Convert opc.Mi5 object to jadeData
      var mi5Object = opcH.mapMi5ArrayToObject(data, self.structTaskObjectBlank());

      taskList[id] = mi5Object;

      if (id == self.NumberOfTasks) {
        self.taskList = taskList;
        console.log(preLog(), 'new Task list pulled');
        callback(err); // final callback
      }
    });
  }); // end self.opc.mi5ReadArray
};

module.prototype.updateTaskListReduced = function(callback) {
  var self = this;

  self.getTaskListReduced(callback);
};

module.prototype.getTaskListActive = function(callback) {
  var self = this;

  var taskListActive = [];
  self.updateTaskListReduced(function() {
    self.taskList.forEach(function(item, index) {
      if (item.Dummy.value === false) {
        taskListActive.push(item);
      }

      if (index == self.taskList.length - 1) {
        callback(taskListActive); // final callback
      }
    });
  });
};

// ///////////////////////////////////////////////////////////////////////////////////////////////////
// OPC UA Subscriptions

/**
 * subscribe all module-specific variables
 * 
 * @param rawData
 * @param callback
 */
module.prototype.subscribe = function() {
  var self = this;

  assert(self.isInitialized, 'opc is not initialized call self.initialize() *async* first');

  var monitor = [];

  self.taskList.forEach(function(item, index) {
    monitor.push({
      nodeId : item.Dummy.nodeId,
      callback : self.onDummyChange,
      entry : item
    });
  });

  self.monitorItems(monitor);
  return 0;
};

/**
 * monitor a list of items and assign a callback event
 * 
 * @param itemArray
 *          <array> [{nodeId: '', callback: cbFunction}]
 * @returns <boolean>
 */
module.prototype.monitorItems = function(itemArray) {
  var self = this;

  assert(_.isArray(itemArray));

  itemArray.forEach(function(item, index) {
    mI = self.opc.mi5Monitor(item.nodeId);
    mI.on('changed', function(data) {
      item.callback(data, item.entry, index);
    });
  });
  return true;
}

module.prototype.onDummyChange = function(data, item, index) {
  var self = mi5TaskInterface; // since it is called before getModuleData

  // console.log(preLog(), data.value.value, self.taskList[index]);

  // Task disappears - look in the updated taskList by index number
  if (data.value.value === true && self.taskList[index].Dummy.value === false) {
    console.log(preLog(), 'task disappears TaskID'.bgYellow, self.taskList[index].TaskID.value);
    io.to(self.socketRoom).emit('taskDisappears', self.taskList[index]);

    self.updateTaskListReduced(function() {
    }); // TODO: be aware, if tasks come too quickly, task list will not be updated!
  }

  // New Task
  if (data.value.value === false && self.taskList[index].Dummy.value === true) {
    self.updateTaskListReduced(function() {
      console.log(preLog(), 'task registered TaskID'.bgGreen, self.taskList[index].TaskID.value);
      io.to(self.socketRoom).emit('taskNew', self.taskList[index]);
    }); // TODO: be aware, if tasks come too quickly, task list will not be updated!
  }
};

// ///////////////////////////////////////////////////////////////////////////////////////////////////
// Sokets to Browser

/**
 * Register the client-side sockets. We need hard-coded instance here, because the scope would bei io
 * 
 * @param socket
 *          <io>
 */
module.prototype.ioRegister = function(socket) {
  var self = mi5TaskInterface; // this would be socket.io io.on('connection')

  _.bindAll(self, 'socketAbortTask'); // reset scope in the new function to the one specified

  assert(typeof socket !== 'undefined');

  socket.on('abortTask', self.socketAbortTask);

  console.log(preLog(), 'OK - Task Interface - event listeners registered');
};

module.prototype.socketAbortTask = function(taskID) {
  var self = this;

  // Look for the task in the task list
  // console.log(preLog(), 'abort Task', taskID);
  if (taskID !== 0) {
    self.taskList.forEach(function(item, index) {
      if (item.TaskID.value == taskID) {
        // Abort it
        self.setValue(item.AbortTask.nodeId, true, function() {
          console.log(preLog(), 'Task aborted!'.bgRed, taskID);
        });
      }
    });
  }
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////
// Backend
/**
 * set a key:value object based on a basenode
 * 
 * @async
 * @param baseNode
 *          <string> 'MI5.Module2402Manual'
 * @param dataObject
 *          <object> {Execute: true}
 * @param callback
 *          <function>
 */
module.prototype.setObject = function(baseNode, dataObject, callback) {
  var self = this;

  assert(typeof baseNode === "string");
  assert(_.isObject(dataObject));

  var Mi5TaskListMapping = require('./../models/simpleDataTypeMapping.js').Mi5TaskList;
  self.opc.mi5WriteObject(baseNode, dataObject, Mi5TaskListMapping, callback);
}

/**
 * set a nodeid value pair (using jadeDate this is useful)
 * 
 * @uses this.setObject()
 * @param nodeId
 *          <string> 'MI5.Module2402Manual.Execute'
 * @param value
 *          <mixed>
 * @param callback
 *          <function>
 */
module.prototype.setValue = function(nodeId, value, callback) {
  var self = this;

  assert(typeof nodeId === "string", 'nodeid must be a string');
  assert(typeof callback === 'function', 'callback must be a function');

  var baseNode = opcH.cutLastElement(nodeId);
  var lastElement = opcH.getLastElement(nodeId);

  var dataObject = {};
  dataObject[lastElement] = value;

  // console.log('setValue'.bgRed, baseNode, dataObject);

  self.setObject(baseNode, dataObject, callback);
}

/*
 * Config Production List
 */

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
      var baseNodeTask = self.structTask('MI5.ProductionList[' + id + '].');

      opc.mi5ReadArray(baseNodeTask, function(err, data) {
        // Convert opc.Mi5 object to jadeData
        var mi5Object = opcH.mapMi5ArrayToObject(data, self.structTaskObjectBlank());

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

/**
 * Get Blank Task-Struct
 * 
 * @returns {___anonymous278_400}
 */
module.prototype.structTaskObjectBlank = function() {
  var self = this;

  // Base
  var taskDummy = {
    AbortTask : '',
    Dummy : '',
    Name : '',
    RecipeID : '',
    Skill : [],
    State : '',
    TaskID : '',
    Timestamp : ''
  };
  // Skills
  _123n(0, self.NumberOfSkills).forEach(function(i) {
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
    _123n(0, self.NumberOfParameters).forEach(function(j) {
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
 * Get Task Structure
 * 
 * @param baseNode
 *          string
 * @return array
 */
module.prototype.structTask = function(baseNode) {
  var self = this;

  var nodes = [ 'AbortTask', 'Dummy', 'Name', 'RecipeID', 'State', 'TaskID', 'Timestamp' ];
  // Add all 50 Skills
  for (var i = 0; i <= self.NumberOfSkills; i++) {
    var temp = self.structTaskSkill('Skill[' + i + '].');
    temp.forEach(function(item) {
      nodes.push(item);
    });
  }
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });

  return nodes;
};

/**
 * Get Reduced Task baseNode
 * 
 * @param baseNode
 *          string
 * @return array
 */
module.prototype.structTaskReduced = function(baseNode) {
  var self = this;

  var nodes = [ 'AbortTask', 'Dummy', 'Name', 'RecipeID', 'State', 'TaskID', 'Timestamp' ];
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });

  return nodes;
};

/**
 * Adds nodes to Skill[x].YYYYYYYYYYY
 * 
 * @param baseNode
 *          <string>
 * @return array
 */
module.prototype.structTaskSkill = function(baseNode) {
  var self = this;

  var nodes = [ 'AssignedModuleID', 'AssignedModuleName', 'AssignedModulePosition', 'Dummy', 'ID',
      'Name' ];
  // Add all 5 Parameters
  for (var i = 0; i <= self.NumberOfParameters; i++) {
    var temp = self.structTaskSkillParameter('UserParameter[' + i + '].');
    temp.forEach(function(item) {
      nodes.push(item);
    });
  }
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });
  return nodes;
};

/**
 * Adds nodes to UserParameter[x].YYYYYYYYYYY
 * 
 * @param baseNode
 *          <string>
 * @return <array>
 */
module.prototype.structTaskSkillParameter = function(baseNode) {
  var self = this;

  var nodes = [ 'Dummy', 'ID', 'Name', 'Unit', 'Required', 'Defualt', 'MinValue', 'MaxValue',
      'Value' ];
  // Prepend baseNode
  nodes = _.map(nodes, function(item) {
    return baseNode + item;
  });
  return nodes;
};