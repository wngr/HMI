
/**
 * OPC UA Route
 * 
 * Content:
 * - Establish, control and terminate opc ua connection
 * - Configures opc ua connection
 * 
 * ToDo:
 * - Create, terminate adn monitor subscription
 * - Read and Write Variables 
 */

/**
 * Configuration
 */
var endpointUrlOpcUAServer = "opc.tcp://localhost:4334/UA/SampleServer";

/**
 * Require necessary packages
 */
var nodeOpcUA = require("node-opcua");
var async = require("async");

/**
 * Handle connection, session and subscription
 */
var nodeOpcUAClient = new nodeOpcUA.OPCUAClient();
var nodeOpcUASession;
var nodeOpcUASubscription;

/**
 * Exported functions
 */
exports.read = function(req, res){
};
exports.write = function(req, res){
};
exports.subscribe = function(req, res){
};
exports.configureSubscription = function(req, res){
};
exports.monitor= function(req, res){
};
