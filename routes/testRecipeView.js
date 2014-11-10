/**
 * Recipe View Router
 */

function index(req, res) {
  var jadeData = new Object;
  var recipeInterface = require('./../models/simpleRecipeInterface');

  // recipeIdArray = [ 0, 1 ];
  // recipeInterface.getRecipes(recipeIdArray, function(err, recipes) {
  recipeInterface.getAllRecipes(function(err, recipes) {
    if (err) {
      jadeData.error = err;
    } else {
      jadeData.recipes = recipes;
      // console.log(JSON.stringify(recipes, null, 1));
      console.log('jadeDate recipes added');
    }

    res.render('bootstrap/testRecipeView', jadeData);
    res.end();
  });
}
exports.index = index;

/**
 * View to place the order
 * 
 * @post
 * @author Thomas Frei
 */
function placeOrder(req, res) {
  var recipeInterface = require('./../models/simpleRecipeInterface');

  var recipeId = req.query.recipeId;
  var postParameters = req.body.userparameter;

  var taskId = CONFIG.TaskId++;

  // Parse Order Object
  var order = {
    Pending : true,
    RecipeID : parseInt(recipeId),
    TaskID : parseInt(taskId),
  }

  // Parse UserParameters Array
  var userParameters = new Array;
  if (postParameters) {
    postParameters.forEach(function(value) {
      userParameters.push({
        Value : parseFloat(value)
      });
    });
  } else {
    // do nothing
  }

  // Debug
  console.log(order, userParameters);

  recipeInterface.order(order, userParameters, function(err, callback) {
    if (err) {
      var jadeData = {
        content : 'Error',
      };
      res.render('bootstrap/blank', jadeData);

    }
    var jadeData = {
      content : 'Order has been placed! The corresponding (unique) TaskID is :' + taskId,
      list : [ {
        href : '/taskViewTest?taskId=' + taskId,
        title : 'Redirect to specific TaskView'
      }, {
        href : '/taskViewTest',
        title : 'Redirect to global TaskView'
      } ]
    };
    res.render('bootstrap/blank', jadeData);
  });

}
exports.placeOrder = placeOrder;

/**
 * Mockup for Bjoern, to develop slider
 * 
 * @static
 * @author Thomas Frei
 */
function mockup(req, res) {

  res.render('bootstrap/testRecipeView', {
    mockup : 1
  });
}
exports.mockup = mockup;