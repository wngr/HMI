
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
var endpointUrl = "opc.tcp://localhost:4334/UA/SampleServer";

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




function myOpcua() {
  EventEmitter.call(this);
}

util.inherits(myOpcua, EventEmitter);

myOpcua.prototype.write = function(data) {
    this.emit("data", data);
}

var stream = new myOpcua();

stream.on("data", function(data) {
    console.log('Received data: "' + data + '"');
});

stream.write("It works!"); // Received data: "It works!"

