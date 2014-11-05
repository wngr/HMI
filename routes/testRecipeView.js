/**
 * New node file
 */

console.log('testRecipeView.js / root');
// SystemTime
setInterval(function() {
  IO.emit('serverTime', Date().toString());
}, 1000);

exports.index = function(req, res) {
  var jadeData = new Object;
  var recipeInterface = require('./../models/simpleRecipeInterface');

  recipeIdArray = [ 1, 3, 14 ]; // Mockdata
  recipeInterface.getRecipes(recipeIdArray, function(err, recipes) {
    console.log(recipes);
    if (err) {
      jadeData.error = err;
    } else {
      jadeData.recipes = recipes;
    }

    res.render('bootstrap/testRecipeView', jadeData);
    res.end();
  });
};

/**
 * View to place the order
 * 
 * @post
 * @author Thomas Frei
 */
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

/**
 * Mockup for Bjoern, to develop slider
 * 
 * @static
 * @author Thomas Frei
 */
exports.mockup = function(req, res) {
  var jadeData = {
    recipes : [ {
      ID : {
        value : 1
      },
      Name : {
        value : 'hi'
      },
      Description : {
        value : 'Das ist eine Description'
      },
      parameters : [ {
        Default : {
          value : 1
        },
        MinValue : {
          value : 1
        },
        MaxValue : {
          value : 5
        }
      }, {
        Default : {
          value : 2
        },
        MinValue : {
          value : 1
        },
        MaxValue : {
          value : 3
        }
      } ]
    } ]
  };
  res.render('bootstrap/testRecipeView', jadeData);
}