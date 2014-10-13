
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
var the_subscription;


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
myOpcua.prototype.connect = function _connect(data) {
  console.log('/_connect() - create client');
  client = new opcua.OPCUAClient();
  console.log('/_connect() - client connect');
  client.connect(endpointUrl, _connected);
};

function _connected(err) {
  console.log('/_connected()');
  if(_checkErrors(err)) {
    opcuaclient.emit("connected", true);
    console.log("/_connected() - connected !");
  }
};

function _checkErrors(err) {
  console.log('/_checkErrors()');
  if(err) {
    console.log('/_checkErrors():', err);
    return false;
  } else {
    console.log("/_checkErrors(): no error");
    return true;
  }
};

var opcuaclient = new myOpcua();

opcuaclient.on("connected", function(data) {
    console.log('Received data: "' + data + '"');
});

opcuaclient.connect("It works! very fine!"); // Received data: "It works!"

