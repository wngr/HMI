/**
 * RecipeInterface
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
var opcuaHelper = require('./opcuaHelper');
var opcuaDataStructure = require('./opcuaDataStructure');

var pEndpointUrl; // p for property
var pLastRecipe = 15;
var pLastParameter = 5;
var pRecipeBaseNode = 'MI5.Recipe';

/***************************************************************************************************
 * Setup Recipe Interface for Job
 */
function setEndpointUrl(endpointUrl) {
  pEndpointUrl = endpointUrl;
}
exports.setEndpointUrl = setEndpointUrl;

/**
 * 
 * @returns
 */
function getAllRecipes(callback) {
  var opcuaInstance = require('./../models/opcuaInstance').server(pEndpointUrl);
  var baseNode = pRecipeBaseNode;
  var recipes = new Array;

  opcuaInstance.on('ready', function() {
    for (var i = 0; i <= pLastRecipe; i++) {
      var recipeNode = baseNode + '.Recipe' + i;
      if (i == pLastRecipe) {
        opcuaInstance.readArrayCB(opcuaDataStructure.recipe(recipeNode),
            function(err, nodes, results) {
              pushResult(err, nodes, results);

              opcuaInstance.disconnect();
              callback(recipes); // final callback
            });
      } else {
        opcuaInstance.readArrayCB(opcuaDataStructure.recipe(recipeNode), pushResult);
      }
    }

    function pushResult(err, nodes, results) {
      var recipe = opcuaHelper.formatResultToObject(err, nodes, results);
      // Check if Dummy or unknown node id
      if (opcuaHelper.noDummy(recipe.Dummy.value)) {
        recipes.push(recipe);
      }
    }
  });

  opcuaInstance.initialize();
}
exports.getAllRecipes = getAllRecipes;

/**
 * 
 * @param recipeIdArray
 * @function callback
 * @returns
 */
function getRecipes(recipeIdArray, callback) {
  var opcuaInstance = require('./../models/opcuaInstance').server(pEndpointUrl);
  var baseNode = 'MI5.Recipe';
  var recipes = new Array;

  opcuaInstance.on('ready', function() {
    recipeIdArray.forEach(function(recipeId) {
      if (recipeId == _.last(recipeIdArray)) {
        opcuaInstance.readArrayCB(opcuaDataStructure.recipe(baseNode + '.Recipe' + recipeId),
            function(err, nodes, results) {
              pushResult(err, nodes, results, function() {

                opcuaInstance.disconnect();
                callback(recipes); // final callback
              });
            });
      } else {
        opcuaInstance.readArrayCB(opcuaDataStructure.recipe(baseNode + '.Recipe' + recipeId),
            pushResult);
      }
    })
  });

  function pushResult(err, nodes, results, callback) {
    var resultObject = opcuaHelper.formatResultToObject(err, nodes, results);
    // console.log(resultObject);
    var nodeId = nodes[0].nodeId.value;
    var id = opcuaHelper.extractRecipeId(nodeId);

    addParameters(id, function(output) {
      resultObject.parameters = output; // define the new parameters property
      if (opcuaHelper.noDummy(resultObject.Dummy.value)) {
        recipes.push(resultObject);
      }
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  function addParameters(id, callback) {
    var parameters = new Array;
    var parameterBaseNode = baseNode + '.Recipe' + id + '.UserParameter';

    for (var i = 0; i <= pLastParameter; i++) {
      if (i == pLastParameter) {
        opcuaInstance.readArrayCB(opcuaDataStructure.recipeUserParameter(parameterBaseNode
            + '.UserParameter' + i), function(err, nodes, results) {
          pushParameterResult(err, nodes, results);
          callback(parameters);
        });
      } else {
        opcuaInstance.readArrayCB(opcuaDataStructure.recipeUserParameter(parameterBaseNode
            + '.UserParameter' + i), pushParameterResult);
      }
    }

    function pushParameterResult(err, nodes, results) {
      var resultObject = opcuaHelper.formatResultToObject(err, nodes, results);
      if (opcuaHelper.noDummy(resultObject.Dummy.value)) {
        parameters.push(opcuaHelper.formatResultToObject(err, nodes, results));
      }
    }
  }

  opcuaInstance.initialize();
}
exports.getRecipes = getRecipes;

/**
 * 
 * @param recipeId
 * @param userparameters
 * @returns
 */
function order(recipeId, userparameters) {
  // amount === undefined, amount = 1;
  var taskIds = new Array();

  var pending; // make queue opcua read
  for (var i = 1; i <= amount; i++) {
    if (pending === 0) {
      // set order
      taskIds.push = newTaskId;
    } else {
      // wait
    }
  }
  ;

  return taskIds;
}
exports.order = order;

/**
 * 
 * @param callback
 * @returns
 */
function whenQueueReady(callback) {
  if (queue.pending == 0) {
    callback();
  } else {
    // setTimeout
    // read again
  }
}