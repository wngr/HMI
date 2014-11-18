/**
 * Handle and execute background services
 * 
 * @author Thomas Frei
 * @date 2014-11-14
 */

// Message Feed
var messageFeed = require('./backgroundMessageFeed');
messageFeed.work();

// Time
var serverTime = require('./backgroundTime.js');
serverTime.work();

// Debug
var debug = require('./backgroundDebug.js');
debug.work();

// // Check OPC UA Connection
// function checkOpcuaConnection(){
// var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAMessageFeed);
// console.log('Initialize Connection Test');
// opc.initialize(function(err){
// if(!err){
// IO.emit('bgOpcuaConnection', 1);
// } else {
// IO.emit('bgOpcuaConnection', 0);
// }
// opc.disconnect();
// });
// }
// setInterval(checkOpcuaConnection, 10*1000);
