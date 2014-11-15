/**
 * Router File
 */
var testModuleView = require('./testModuleView');
var recipes = require('./recipes');
var tasks = require('./tasks');
var manualModule = require('./manualModule');

/**
 * Routes
 */
exports.router = function(app) {
  app.get('/', index);
  app.get('/testModuleView', testModuleView.index);
  
  // Recipes / Order
  app.get('/order', recipes.index);
  app.get('/order/direct/:recipeId', recipes.directOrder);
  app.get('/order/placed/:taskId', recipes.orderPlaced);
  app.get('/order/ifeellucky', recipes.ifeellucky);
  app.post('/testRecipeView', recipes.placeOrder);
  app.get('/testRecipeViewMock', recipes.mockup);
  
  // Tasks
  app.get('/task_list', tasks.taskList);
  app.get('/testManualModuleView', manualModule.showModule);
  
  // Manual
  app.get('/manual', manualModule.showModule);
  
  // Test
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
IO.on('connection', function(socket) {
  connectedClients++;
  console.log('Connected Clients now:', connectedClients);

  // Disconnect
  socket.on('disconnect', function() {
    var oldClients = connectedClients;
    connectedClients--;
    console.log('Number of users from '+oldClients+' to '+connectedClients);

    if (connectedClients === 0) {
    }
  });
  
  // Register Listeners for backgroundDebug
  require('./../controller/backgroundDebug').listeners(socket);
  
  // Register Manual Module Listeners
  require('./../models/simpleManualModule').readyToRegister(function(rawData){
    rawData.forEach(function(item){
      console.log('///////////////////////////////////////////////');
      console.log(item.submitEvent);
      socket.on(item.submitEvent, function(data) {
        console.log('Gute Neuigkeiten:', data);
      });
    });
  });
  
  socket.on('submitEvMI5.Module2401Manual.TaskID', function(data){
    console.log('manueller',data);
  });
  
});