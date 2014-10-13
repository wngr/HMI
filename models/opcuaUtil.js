
/*
 * Load node-opcua module
 */
var opcua = require('node-opcua');
var async = require('async');
var util = require('util');
var EventEmitter = require('events').EventEmitter; 
console.log('Module: opcuaUtil loaded');

/*
 * Endpoint URL to OPC UA Server
 */
//var endpointUrl = "opc.tcp://localhost:4334/UA/SampleServer";
var endpointUrl = "opc.tcp://192.168.175.230:4840";

/*
 * Client Handle
 */
var client;

/*
 * OPC UA Session Handle
 */
var session;

/*
 * Subscription Handle
 */
var subscription;

/*
 * IsConnected to OPC UA Server
 */
var isConnected = false;

/*
 * Create Class (OOP in JS is like this)
 * http://howtonode.org/prototypical-inheritance
 */
function myOpcua() {
  EventEmitter.call(this);
}

/*
 * Use EventEmitter in the newly created class.
 */
util.inherits(myOpcua, EventEmitter);

/*
 * Create Method for class.
 */
myOpcua.prototype.connect = function _connect() {
  console.log('/_connect() - create client');
  if(!isConnected) {
    client = new opcua.OPCUAClient();
    console.log('/_connect() - client connect');
    client.connect(endpointUrl, _connected);    
  } else {
    console.log('/_connect() - myOpcua is already connected');
  }
};

function _connected(err) {
  console.log('/_connected()');
  if(_checkErrors(err)) {
    isConnected = true;
    opcuaclient.emit("connected", true);
  }
}

function _checkErrors(err) {
  console.log('/_checkErrors()');
  if(err) {
    console.log('/_checkErrors():', err);
    return false;
  } else {
    console.log("/_checkErrors(): no error");
    return true;
  }
}

var opcuaclient = new myOpcua();
opcuaclient.connect();

opcuaclient.on("connected", function(data) {
    console.log('/on:connected: let\'s start working!');
});


