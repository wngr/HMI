/**
 * New node file
 */

var hmiDev = require('./hmidev');
var testBootstrap = require('./testBootstrap');
// var dashBoard = require('./routes/dashboard');
var testJonas = require('./testJonas');
var testModuleView = require('./testModuleView');
var testRecipeView = require('./testRecipeView');

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

exports.router = function(app) {
  app.get('/', index);
  app.get('/testBootstrap', testBootstrap.index);
  app.get('/testJonas', testJonas.index);
  app.get('/testModuleView', testModuleView.completeModule);
  app.get('/testRecipeView', testRecipeView.index);
  app.post('/testRecipeView', testRecipeView.placeOrder);
  app.get('/testRecipeViewMock', testRecipeView.mockup);
  app.post('/testRecipeViewMock', testRecipeView.placeOrder);
  // app.get('/orderRecipe' )
  return app;
};

/**
 * Socket Events
 */
// SystemTime
setInterval(function() {
  IO.emit('serverTime', Date().toString());
}, 1000);