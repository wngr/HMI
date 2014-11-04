/**
 * New node file
 */

console.log('testModuleView.js / root');
// SystemTime
setInterval(function() {
  IO.emit('serverTime', Date().toString());
}, 1000);

exports.index = function(req, res) {
  jadeData = {};

  var recipeInterface = require('./../models/recipeInterface');
  recipeInterface.setRecipeUrl('opc.tcp://localhost:4334/');
  // moduleInterface.setEndpointUrl('opc.tcp://192.168.175.229:4840/'); // MI5Simu
  // moduleInterface.setModule('Module2001'); // MI5Simu
  recipeInterface.getAllRecipes(function(recipes) {
    console.log(recipes);
    jadeData.recipes = recipes;
    res.render('bootstrap/testModuleView', jadeData);
  });
};