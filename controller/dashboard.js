/**
 * Overview with charts Router
 */

function index(req, res) {
  var jadeData = new Object;
  // var interface = require('./../models/simpleTaskInterface');

  // recipeIdArray = [ 0, 1 ];
  // recipeInterface.getRecipes(recipeIdArray, function(err, recipes) {
  // interface.getAllTasks(function(err, data) {
  // if (err) {
  // jadeData.error = err;
  // } else {
  // jadeData.tasks = data;
  // // console.log(JSON.stringify(recipes, null, 1));
  // console.log('data to jadeDate added');
  // }
  //
  // });
  res.render('sbadmin2/dashboard', jadeData);
  res.end();
}
exports.index = index;