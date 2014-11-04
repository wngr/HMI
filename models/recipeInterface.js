/**
 * RecipeInterface
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
var opcuaHelper = require('./opcuaHelper');
var opcuaDataStructure = require('./opcuaDataStructure');

var pRecipeUrl, pQueueUrl; // p for property
var pLastRecipe = 15;
var pLastParameter = 5;
var pRecipeBaseNode = 'MI5.Recipe';

/***************************************************************************************************
 * Setup Recipe Interface for Job
 */
function setRecipeUrl(endpointUrl) {
  pRecipeUrl = endpointUrl;
}
exports.setRecipeUrl = setRecipeUrl;

function setQueueUrl(endpointUrl) {
  pQueueUrl = endpointUrl;
}
exports.setQueueUrl = setQueueUrl;
/**
 * 
 * @returns
 */
function getAllRecipes(callback) {
  var recipeIdArray = new Array();

  for (var i = 0; i <= pLastRecipe; i++) {
    recipeIdArray.push(i);
  }

  getRecipes(recipeIdArray, callback);
}
exports.getAllRecipes = getAllRecipes;

/**
 * 
 * @param recipeIdArray
 * @function callback(recipesArray)
 * @returns
 */
function getRecipes(recipeIdArray, callback) {
  var opcuaInstance = require('./../models/opcuaInstance').server(pRecipeUrl);
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
 * @async
 * @param recipeId
 * @param userparameters
 * @callback callback(taskId)
 */
function order(recipeId, userparameters, orderCallback) {
  var opcuaQueue = require('./../models/opcuaInstance').server(pQueueUrl);

  whenQueueReady(function() {
    console.log('order now!');
    newTaskId = _.uniqueId();
    async.series([ function(callback) {
      console.log('step 1');
      callback();
    }, function(callback) {
      console.log('step 2');

      callback();
    } ], orderCallback);
  });
}
exports.order = order;

/**
 * 
 * @async
 * @param callback
 * @returns
 */
function whenQueueReady(callback) {
  var opcuaQueue = require('./../models/opcuaInstance').server(pQueueUrl);

  opcuaQueue.on('ready', function() {
    opcuaQueue.subscribe();
    var monitorPending = opcuaQueue.monitor('ns=4;s=MI5.Queue.Queue0.Pending');
    monitorPending.on('changed', function(data, additional) {
      if (data.value.value == 0) {
        // opcuaQueue.disconnect(); // causes assert error in opcua_client:552
        callback(data.value.value);
      }
    });
  });
  opcuaQueue.initialize();
  return 0;
}
exports.whenQueueReady = whenQueueReady;

function writeOrder(recipeId, userparameters, taskId, callback) {

}