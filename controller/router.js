/**
 * Router Files
 */
var testModuleView = require('./testModuleView');
// Recipes / Order
var recipes = require('./recipes');
// Tasklist
var tasks = require('./tasks');
// Modules
var manualModule = require('./manualModule');
var maintenanceModule = require('./maintenanceModule');
var inputModule = require('./inputModule');
var outputModule = require('./outputModule');

// Dashboard / Overview
var overviewCharts = require('./overviewCharts');
var dashboard = require('./dashboard');

/**
 * Routes
 */
exports.router = function(app) {
  app.get('/', index);
  app.get('/testModuleView', testModuleView.index);

  // Recipes / Order
  app.get('/order', recipes.index);
  // Direct Order
  app.get('/order/ifeellucky', recipes.ifeellucky);
  app.get('/order/direct/:recipeId', recipes.directOrder);
  app.get('/order/placed/:taskId', recipes.orderPlaced);
  // Custom Order
  app.get('/order/custom/:recipeId', recipes.customOrder);
  app.post('/order/order/:recipeId', recipes.placeOrder);

  // Tasks
  app.get('/task_list', tasks.taskList);
  app.get('/testManualModuleView', manualModule.showModule);

  // Manual Module
  app.get('/manual', manualModule.showModule);

  // Maintenance Module
  app.get('/maintenance', maintenanceModule.showModule);

  // Overview
  app.get('/overview', overviewCharts.charts);

  // Dashboard
  app.get('/dashboard', dashboard.index);

  // Manual Input
  app.get('/input', inputModule.index);

  // Manual Output
  app.get('/output', outputModule.index);

  // Test
  app.post('/testRecipeView', recipes.placeOrder);
  app.get('/testRecipeViewMock', recipes.mockup);
  app.get('/sbadmin2Welcome', function(req, res) {
    res.render('sbadmin2/_welcome');
  });
  app.get('/sbadmin2Home', function(req, res) {
    res.render('sbadmin2/_home');
  });
  return app;
};

/*
 * Dashboard List
 */
function index(req, res) {
  res.redirect('/order');
}

var connectedClients = 0;
io.on('connection', function(socket) {
  connectedClients++;
  console.log('Connected Clients now:', connectedClients);

  // Register Listeners for backgroundDebug
  require('./../controller/backgroundDebug').sockets(socket);

  // Message Feed Module - Initial emit
  mMessageFeed.emitMessageFeedInitial();

  // Disconnect
  socket.on('disconnect', function() {
    var oldClients = connectedClients;
    connectedClients--;
    console.log('Number of users from ' + oldClients + ' to ' + connectedClients);
  });
});
