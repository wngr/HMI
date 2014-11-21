/**
 * Manual Module in Class-Architecture // other Name
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-020
 */
var jadeH = require('./simpleJadeHelper');
var opcH = require('./simpleOpcuaHelper');
var assert = require('assert');

var mi5MaintenanceModule = require('./mi5MaintenanceModule');
manualModule.prototype = mi5MaintenanceModule.maintenanceModule; // inherit the class
manualModule.prototype.constructor = manualModule;
manualModule.prototype.parent = mi5MaintenanceModule.maintenanceModuleParent.prototype;

/**
 * Manual Module Constructor
 */
function manualModule() {
  this.NumberOfParameters = 5;

  this.isInitialized = false;
  this.rawData = undefined;
  this.jadeData = undefined;

  this.socketRoom = 'manual-module';
  this.ModuleId = '2402';

  this.opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAHandModule);
  console.log('endpoint', CONFIG.OPCUAHandModule);
}
exports.manualModule = new manualModule();

/*
 * Make duplicate functions
 */
// manualModule.prototype.getModuleData = function(callback) {
// var self = this;
// this.parent.getModuleData(callback);
// }
// Overwrite because of hard-coded mi5Manual instance in socket.io-scope
manualModule.prototype.onBusyChange = function(data) {
  var self = mi5Manual; // since it is called before getModuleData

  if (data.value.value === true) {
    io.to(self.socketRoom).emit('busyIsTrue', true);
  }
  console.log('onBusyChange', data.value.value);
};
manualModule.prototype.onDoneChange = function(data) {
  var self = mi5Manual; // since it is called before getModuleData

  if (data.value.value === true) {
    io.to(self.socketRoom).emit('doneIsTrue', true);
  }
  console.log('onDoneChange', data.value.value);
};

manualModule.prototype.onExecuteChange = function(data) {
  var self = mi5Manual; // since it is called before getModuleData

  if (data.value.value === true) {
    io.to(self.socketRoom).emit('executeIsTrue', true);
    io.to(self.socketRoom).emit('reloadPage', 0);
    // Navbar
    io.emit('manualRequired', true);
  }
  if (data.value.value === false) {
    // task fully finished
    self.setValue(self.jadeData.Done.nodeId, false, function() {
    });
    io.emit('manualRequired', true);
    io.to(self.socketRoom).emit('reloadPage', 0);
  }
  console.log('onExecuteChange', data.value.value);
};

// Overwrite because of hard-coded mi5Manual instance in socket.io-scope
manualModule.prototype.ioRegister = function(socket) {
  var self = mi5Manual; // this would be socket.io io.on('connection')

  _.bindAll(self, 'socketUserIsBusy', 'socketUserIsDone'); // reset scope

  assert(typeof socket !== 'undefined');

  socket.on('userIsBusy', self.socketUserIsBusy);
  socket.on('userIsDone', self.socketUserIsDone);

  console.log('OK - Maintenance Module - event listeners registered');
}