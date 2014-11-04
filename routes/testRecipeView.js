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
  recipeInterface.setRecipeUrl('opc.tcp://localhost:4334/');
  recipeInterface.getAllRecipes(function(recipes) {
    jadeData.recipes = recipes;
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
  queueInterface.setQueueUrl('opc.tcp://localhost:4334/');
  queueInterface.order(recipeId, userParameters, function() {
    console.log('order set');
  });

  var jadeData = {
    content : 'hi'
  };
  res.render('bootstrap/blank', jadeData);
  res.end();
}