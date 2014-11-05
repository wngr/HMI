/**
 * New node file
 */

console.log('testModuleView.js / root');
// SystemTime
setInterval(function() {
  IO.emit('serverTime', Date().toString());
}, 1000);

exports.index = function(req, res) {
  var jadeData = new Object;

  var recipeInterface = require('./../models/recipeInterface');
  // recipeInterface.setRecipeUrl('opc.tcp://localhost:4334/');
  recipeInterface.setRecipeUrl('opc.tcp://192.168.175.230:4840/');
  recipeInterface.getAllRecipes(function(recipes) {
    console.log(recipes);
    if (recipes.error == 1) {
      jadeData.error = recipes.err;
    } else {
      jadeData.recipes = recipes;
    }

    res.render('bootstrap/testRecipeView', jadeData);
    res.end();
  });
};

exports.placeOrder = function(req, res) {
  console.log(req.body);
  console.log(req.query);
  var recipeId = req.query.recipeId;

  //
  var taskId = _.uniqueId();

  var postParameters = req.body.userparameter;
  var userParameters = new Array;
  postParameters.forEach(function(value) {
    userParameters.push({
      Value : value
    });
  });

  var queueInterface = require('./../models/recipeInterface');
  // recipeInterface.setRecipeUrl('opc.tcp://localhost:4334/');
  recipeInterface.setRecipeUrl('opc.tcp://192.168.175.230:4840/');
  queueInterface.order(recipeId, userParameters, function() {
    console.log('order set');
  });

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
  res.end();
}