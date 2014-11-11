/**
 * Recipe View Router
 */

function showTask(req, res) {
  var jadeData = new Object;
  var interface = require('./../models/simpleTaskInterface');

  // recipeIdArray = [ 0, 1 ];
  // recipeInterface.getRecipes(recipeIdArray, function(err, recipes) {
  interface.getTasks([ 0 ], function(err, data) {
    if (err) {
      jadeData.error = err;
    } else {
      jadeData.tasks = data;
      // console.log(JSON.stringify(recipes, null, 1));
      console.log('data to jadeDate added');
    }

    res.render('bootstrap/testTaskView', jadeData);
    res.end();
  });
}
exports.showTask = showTask;

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
  var userParameters = _handlePostParameters(postParameters);

  // Debug
  console.log('placeOrder(): ', order, userParameters);

  recipeInterface.setOrder(order, userParameters, function(err, callback) {
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

function _handlePostParameters(postParameters) {
  var userParameters = new Array;

  if (postParameters) {
    if (_.isArray(postParameters)) {
      // Handle Array (1+ parameter)
      postParameters.forEach(function(value) {
        userParameters.push({
          Value : parseFloat(value)
        });
      });
    } else {
      // Handle 1 parameter
      userParameters.push({
        Value : parseFloat(postParameters)
      });
    }
    return userParameters;
  } else {
    return userParameters; // empty array
  }
}

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