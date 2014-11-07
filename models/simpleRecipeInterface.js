/**
 * RecipeInterface
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
var opcH = require('./simpleOpcuaHelper');
var jadeH = require('./simpleJadeHelper');
var opcuaDataStructure = require('./opcuaDataStructure');

/**
 * Get recipes
 * 
 * @async
 * @param recipeIdArray
 * @function callback(err, recipesArray)
 */
function getRecipes(recipeIdArray, callback) {

  var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.175.230:4840/');
  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    recipesArray = [];
    // Loop
    recipeIdArray.forEach(function(id) {
      var recipe = opc._structRecipeBase('MI5.Recipe[' + id + '].');
      opc.mi5ReadArray(recipe, function(err, data) {
        // Push Jade-Formatted Data
        var output = jadeH.convertMi5ReadArrayRecipeToJade(data);
        recipesArray.push(output);

        // console.log(output.UserParameters[0].Name);
        // console.log(output);

        // Callback on last element
        if (id == _.last(recipeIdArray)) {
          callback(err, recipesArray);
        }
      }); // end opc.mi5ReadArray
    }); // end for
  }); // end opc.initialize()

}
exports.getRecipes = getRecipes;

function getAllRecipes() {
}

/**
 * 
 * @async
 * @param recipeId
 * @param userparameters
 * @callback callback(taskId)
 */
function order(recipeId, userParameterArray, callback) {
  var assert = require('assert');
  assert(typeof callback === 'function');

  var opc = require('./../models/simpleOpcua').server('opc.tcp://192.168.175.209:4840/');
  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    whenQueueReady(opc, function(err) {
      console.log('order now!');
      newTaskId = _.uniqueId();
      async.series([ function(callback) {
        var nodeDataObject = {
          Name : 'Test',
          RecipeID : recipeId,
          UserParameter : userParameterArray
        };

        var nodeDataObject = {
          RecipeID : 5
        };

        opc.mi5WriteObject('MI5.Order[0]', nodeDataObject, callback);
      } ], function(err) {
        opc.disconnect();
        callback(err);
      });
    });
  });

}
exports.order = order;

/**
 * 
 * @async
 * @param opc
 *          <object> Instance of simpleOpcua
 * @param callback
 * @returns
 */
function whenQueueReady(opc, callback) {
  opc.mi5Subscribe();

  var mon = opc.mi5Monitor('MI5.Order[0].Pending');
  mon.on('changed', function(data) {
    if (data.value.value == 0) {
      callback(data.value.value);
    }
  });
  return 0;
}
exports.whenQueueReady = whenQueueReady;
