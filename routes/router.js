/**
 * New node file
 */

var hmiDev    = require('./hmidev');
var testBootstrap = require('./testBootstrap');
//var dashBoard = require('./routes/dashboard');
//var testSocket = require('./routes/testSocket');
var testJonas = require('./testJonas');
//var testGuiElements = require('./testGuiElements');
//var testOpcuaInstance = require('./routes/testOpcuaInstance');
//var controlOpcuaSocket = require('./routes/testOpcua.js');



function index(req, res){
  res.render('hmiDev', { title: 'Project MI5 - HMI Development Environment' });
}

function hmiDev(req, res){
  
}

exports.router = function(app){
  app.get('/', index);
//  app.get('/testGuiElements', testGuiElements.index);
  app.get('/testBootstrap', testBootstrap.index);
  app.get('/testJonas', testJonas.index);
  return app;
};