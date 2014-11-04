/**
 * New node file
 */

var hmiDev = require('./hmidev');
var testBootstrap = require('./testBootstrap');
// var dashBoard = require('./routes/dashboard');
// var testSocket = require('./routes/testSocket');
var testJonas = require('./testJonas');
var testModuleView = require('./testModuleView');
var testRecipeView = require('./testRecipeView');
// var testGuiElements = require('./testGuiElements');
// var testOpcuaInstance = require('./testOpcuaInstance');
// var controlOpcuaSocket = require('./routes/testOpcua.js');
// var orderRecipe = require('');

// var myInstance = require('./testOpcuaInstance');

function index(req, res) {
  jadeData = {
    content : 'Overview of all the testing modules that are available',
    list : [ {
      href : 'testModuleView',
      title : 'Module View (Test)'
    } ]
  }
  res.render('./bootstrap/blank', jadeData);
}

function hmiDev(req, res) {

}

function testOpcuaInstance(req, res) {
  return res.render('bootstrap/blank', {
    content : 'hallo'
  });
}

exports.router = function(app) {
  app.get('/', index);
  // app.get('/testGuiElements', testGuiElements.index);
  app.get('/testBootstrap', testBootstrap.index);
  app.get('/testJonas', testJonas.index);
  app.get('/testModuleView', testModuleView.completeModule);
  app.get('/testOpcuaInstance', testOpcuaInstance);
  app.get('/testRecipeView', testRecipeView.index);
  app.post('/testRecipeView', testRecipeView.placeOrder);
  // app.get('/orderRecipe' )
  return app;
};