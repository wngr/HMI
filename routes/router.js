/**
 * Router File
 */
var testModuleView = require('./testModuleView');
var recipeView = require('./recipeView');
var taskView = require('./taskView');
var manualModule = require('./manualModule');

/**
 * Background Service
 */
var messageFeed = require('./messageFeed');

/**
 * Routes
 */
exports.router = function(app) {
  app.get('/', index);
  app.get('/testModuleView', testModuleView.index)
  app.get('/testRecipeView', recipeView.index);
  app.post('/testRecipeView', recipeView.placeOrder);
  app.get('/testRecipeViewMock', recipeView.mockup);
  app.get('/testTaskView', taskView.showTask);
  app.get('/testManualModuleView', manualModule.showModule);
  app.get('/sbadmin2', function(req, res) {
    res.render('sbadmin2/_welcome');
  });
  app.get('/sbadmin2Home', function(req, res) {
    res.render('sbadmin2/_home');
  });
  return app;
};

/*
 * Socket Events
 */
// SystemTime
setInterval(function() {
  IO.emit('serverTime', Date().toString());
}, 1000);

/*
 * Dashboard List
 */
function index(req, res) {
  jadeData = {
    content : 'Overview of all the testing modules that are available',
    list : [ {
      href : 'testRecipeView',
      title : 'Recipe View (Test)'
    } ]
  }
  res.render('./bootstrap/blank', jadeData);
}
