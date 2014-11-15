var _ = require("underscore");
var opcH = require("./simpleOpcuaHelper");

/**
 * Create Jade-Compatible Array out of one Recipe[0]. result
 * 
 * @param data
 *          <array> (e.g. [{nodeId: ..., value: ..., sub...},{},{}]
 * @return
 */
function convertMi5ReadArrayRecipeToJade(data) {
  var NumberOfSubArrayParameters = 5; // Recipe UserParameter[0-5]
  var NameOfSubArrayObject = 'UserParameter';

  var recipe = new Object;
  data.forEach(function(item) {
    var nodeElements = opcH.splitNodeId(item.nodeId);
    // console.log(nodeElements);
    // For Recipe-layer
    if (nodeElements.length == 3) {
      var last = _.last(nodeElements); // get Name of desired Parameter (last = RecipeID)
      if (!opcH.detectIfArray(last)) {
        recipe[last] = item;
      }
    }
  });
  var parameterArray = new Array;

  // Loop over the whole array
  for (var parameter = 0; parameter <= NumberOfSubArrayParameters; parameter++) {
    var singleParameterArray = new Object;
    data.forEach(function(item) {
      var nodeElements = opcH.splitNodeId(item.nodeId);
      // console.log(nodeElements);
      // Look only on UserParameterLayer
      if (nodeElements.length == 4) {
        var last = _.last(nodeElements); // e.g. Value
        nodeElements.pop();
        var secondlast = _.last(nodeElements); // e.g. UserParameter[1]

        if (opcH.detectIfArray(secondlast)) {
          // and only add it, if userParameter is the x-th element in the for-loop
          if (parameter == opcH.stripArrayKey(secondlast)) {
            singleParameterArray[last] = item;
          }
        }
      }
    });
    // Do not push dummy parameters:
    if (singleParameterArray.Dummy.value === false) {
      parameterArray.push(singleParameterArray);
    } else {
      // do nothing
    }
  }
  // console.log(parameterArray);
  recipe[NameOfSubArrayObject] = parameterArray;

  return recipe;
}
exports.convertMi5ReadArrayRecipeToJade = convertMi5ReadArrayRecipeToJade;

/**
 * deprecated
 * 
 * Create Jade-Compatible Array out of one Recipe[0]. result
 * 
 * @param data
 *          <array> (e.g. [{nodeId: ..., value: ..., sub...},{},{}]
 * @return
 */
function convertMi5ReadArrayTaskToJade(data) {
  // First layer
  var tasks = new Object;
  data.forEach(function(item) {
    var nodeElements = opcH.splitNodeId(item.nodeId);
    // console.log(nodeElements);
    // For Recipe-layer
    if (nodeElements.length == 3) {
      var last = _.last(nodeElements); // get Name of desired Parameter (last = RecipeID)
      if (!opcH.detectIfArray(last)) {
        tasks[last] = item;
      }
    }
  });

  // First depth
  var NumberOfSubArrayParameters = 50; // Recipe UserParameter[0-5]
  var NameOfSubArrayObject = 'Skill';
  var parameterArray = new Array;
  for (var parameter = 0; parameter <= NumberOfSubArrayParameters; parameter++) {
    var singleParameterArray = new Object;
    data.forEach(function(item) {
      var nodeElements = opcH.splitNodeId(item.nodeId);
      // console.log(nodeElements);
      // Look only on Skill-Layer
      if (nodeElements.length == 4) {
        var last = _.last(nodeElements); // e.g. Value
        nodeElements.pop();
        var secondlast = _.last(nodeElements); // e.g. UserParameter[1]

        if (opcH.detectIfArray(secondlast)) {
          // and only add it, if userParameter is the x-th element in the for-loop
          if (parameter == opcH.stripArrayKey(secondlast)) {
            singleParameterArray[last] = item;
          }
        }
      }
    });
    // // Do not push dummy parameters:
    // if (singleParameterArray.Dummy.value === false) {
    // parameterArray.push(singleParameterArray);
    // } else {
    // // do nothing
    // }
  }
  // console.log(parameterArray);
  tasks[NameOfSubArrayObject] = parameterArray;

  return tasks;
}
exports.convertMi5ReadArrayTaskToJade = convertMi5ReadArrayTaskToJade;

function convertMi5ReadArrayMessageFeed(data) {
  var entry = new Object;
  data.forEach(function(item) {
    var nodeElements = opcH.splitNodeId(item.nodeId);
    // console.log(nodeElements);
    var last = _.last(nodeElements); // get Name of desired Parameter (e.g. last = Level)
    entry[last] = item;
  });
  return entry;
}
exports.convertMi5ReadArrayMessageFeed = convertMi5ReadArrayMessageFeed;

function convertMi5ReadArraySingle(data) {
  var entry = new Object;
  data.forEach(function(item) {
    var nodeElements = opcH.splitNodeId(item.nodeId);
    // console.log(nodeElements);
    var last = _.last(nodeElements); // get Name of desired Parameter (e.g. last = Level)
    entry[last] = item;
  });
  return entry;
}
exports.convertMi5ReadArraySingle = convertMi5ReadArraySingle;