/**
 * RecipeInterface
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
var jadeH = require('./simpleJadeHelper');
var assert = require('assert');

/**
 * Find the nodeId to the corresponding Recipe ID
 * 
 * @param recipeId
 * @param callback
 */
function getRecipeByRecipeId(recipeId, callback) {
  assert(_.isNumber(recipeId));
  assert(typeof callback === "function");
  assert(recipeId !== 0); // must not be 0

  var recipeArray = [];

  getAllRecipes(function(err, array) {
    array.forEach(function(recipe) {
      var id = parseInt(recipe.RecipeID.value, 10);
      if (id == recipeId) {
        recipeArray.push(recipe);
        callback(err, recipeArray);
      }
    });
  });
}
exports.getRecipeByRecipeId = getRecipeByRecipeId;

/**
 * Get recipes
 * 
 * @async
 * @param recipeStructIdArray
 * @function callback(err, recipesArray)
 */
function getRecipes(recipeStructIdArray, callback) {
  assert(_.isArray(recipeStructIdArray));
  assert(typeof callback === "function");

  var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUARecipe);

  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    recipesArray = [];
    // Loop
    recipeStructIdArray.forEach(function(id) {
      var recipe = opc._structRecipeBase('MI5.Recipe[' + id + '].');
      opc.mi5ReadArray(recipe, function(err, data) {
        // Push Jade-Formatted Data
        var output = jadeH.convertMi5ReadArrayRecipeToJade(data);

        // Check for Dummy
        if (output.Dummy.value != true) {
          recipesArray.push(output);
        }

        // console.log(output.UserParameters[0].Name);
        // console.log(output);

        // Callback on last element
        if (id == _.last(recipeStructIdArray)) {
          opc.disconnect();
          callback(err, recipesArray);
        }
      }); // end opc.mi5ReadArray
    }); // end for
  }); // end opc.initialize()

}
exports.getRecipes = getRecipes;

/**
 * Get all recipes
 * 
 * @async
 */
function getAllRecipes(callback) {
  recipeIdArray = [];
  for (var i = 0; i <= 30; i++) {
    recipeIdArray.push(i);
  }

  getRecipes(recipeIdArray, callback);
}
exports.getAllRecipes = getAllRecipes;

/**
 * 
 * 
 * @async
 * @param recipeId
 * @param userparameters
 * @callback callback(taskId)
 */
function setOrder(order, userParameters, callback) {
  var assert = require('assert');
  assert(typeof callback === 'function');
  assert(typeof order === 'object');
  assert(_.isArray(userParameters));

  var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAOrder);
  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    opc.mi5Subscribe();
    var queue = opc.mi5Monitor('MI5.Order[0].Pending');
    queue.on('changed', function(data) {
      if (data.value.value === false) {
        // Queue is ready
        console.log('monitor Pending changed: ', data.value.value, ' -- order!');

        // Write Order in MI5.Order
        async.series([ function(callback) {
          opc.mi5WriteOrder('MI5.Order[0]', order, userParameters, callback);
        } ], function(err) {
          opc.disconnect();
          callback(err); // final callback
        });
      } else {
        // no action, wait until queue is ready
        console.log('Waiting... Pending is: ', data.value.value);
      }
    });

  });

}
exports.setOrder = setOrder;
