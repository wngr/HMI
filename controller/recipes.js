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
      console.log('getAllRecipes() done.');
    }

    res.render('sbadmin2/order', jadeData);
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
    RecipeID : parseInt(recipeId, 10),
    TaskID : parseInt(taskId, 10),
  };

  // Parse UserParameters Array
  var userParameters = _handlePostParameters(postParameters);

  // Debug
  console.log(order, userParameters);

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

function ifeellucky(req,res){
  var jadeData = {};
  var recipeInterface = require('./../models/simpleRecipeInterface');
  recipeInterface.getAllRecipes(function(err, recipes) {
    if (err) {
      jadeData.error = err;
    } else {
      // Generate random Recipe ID
      var recipeIds = [];
      recipes.forEach(function(recipe){
        recipeIds.push(recipe.RecipeID.value);
      })
      var luckyId = _.sample(recipeIds);
      
      console.log('getAllRecipes() done - i feel lucky - LuckyRecipeId:', luckyId);
      
      // Parse Order Object
      var taskId = CONFIG.TaskId++;
      var order = {
        Pending : true,
        RecipeID : parseInt(luckyId, 10),
        TaskID : parseInt(taskId, 10),
      };

      // Parse UserParameters Array
      var userParameters = [];

      // Perform Order
      var recipeInterface = require('./../models/simpleRecipeInterface');
      recipeInterface.setOrder(order, userParameters, function(err, callback) {
        if (err) {
          console.log('RecipeInterface - an error has occured:',err);
          res.redirect('order/error/');
        }
        res.redirect('/order/placed/'+taskId);
      });
      
    }
  });
}
exports.ifeellucky = ifeellucky;

function directOrder(req, res){
  var recipeId = parseInt(req.params.recipeId, 10);
  assert(_.isNumber(recipeId));
  console.log('Perform direct order. RecipeID: ',recipeId);

  // Parse Order Object
  var taskId = CONFIG.TaskId++;
  var order = {
    Pending : true,
    RecipeID : parseInt(recipeId, 10),
    TaskID : parseInt(taskId, 10),
  };

  // Parse UserParameters Array
  var userParameters = [];

  // Perform Order
  var recipeInterface = require('./../models/simpleRecipeInterface');
  recipeInterface.setOrder(order, userParameters, function(err, callback) {
    if (err) {
      console.log('RecipeInterface - an error has occured:',err);
      res.redirect('order/error/');
    }
    res.redirect('/order/placed/'+taskId);
  });
  
}
exports.directOrder = directOrder;

function orderPlaced(req,res){
  var taskId = parseInt(req.params.taskId, 10);
  assert(_.isNumber(taskId));
  
  var jadeData = {};
  jadeData.taskId = taskId;

  // Get Task List in Timeline
  var interface = require('./../models/simpleTaskInterface');
  interface.getAllTasks(function(err, data) {
    if (err) {
      jadeData.error = err;
    } else {
      jadeData.tasks = data;
      // console.log(JSON.stringify(recipes, null, 1));
      console.log('data to jadeDate added');
    }
    
    // mark the new task
    //todo

    res.render('sbadmin2/order_task_list', jadeData);
    res.end();
  });
}
exports.orderPlaced = orderPlaced;