
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
var endpointUrlToOpcUAServer = "opc.tcp://localhost:4334/UA/SampleServer";

/**
 * Require necessary packages
 */
var nodeOpcUA = require("node-opcua");
var async = require("async");

/**
 * Handle connection, session and subscription
 */
var nodeOpcUAClient = new nodeOpcUA.OPCUAClient();

/*
 * Member that stores the internal connection to the OPC UA Server
 */
var nodeOpcUASession;

/*
 * Member that stores a Subscription to a Node of a OPC UA Server.
 */
var nodeOpcUASubscription;

function init()
{
	async.series([
	],
	function(err) {
		if (err) {
			console.log(" failure ",err);
		} else {
			console.log("done!");
		}
		nodeOpcUAClient.disconnect(function(){});
	});
};

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
exports.dir = function(req, res){
	init();
	async.series([
		//step 1 : connect to
		function(callback) {
			nodeOpcUAClient.connect(endpointUrlToOpcUAServer, function(err) {
				if(err) {
					console.log("cannot connect to endpoint :" , endpointUrlToOpcUAServer );
				} else {
					console.log("connected !");
				}
				callback(err);
			});
		},
		//step 2 : createSession
		function(callback) {
			nodeOpcUAClient.createSession( function(err,session) {
				if(!err) {
					nodeOpcUASession = session;
				}
				callback(err);
			});
		},
		function(callback) {
			nodeOpcUASession.browse("RootFolder", function(err,browse_result){
				if(!err) {
					browse_result[0].references.forEach(function(reference) {
						console.log( reference.browseName);
					});
				}
				callback(err);
			});
		}
	],
	function(err) {
		if (err) {
			console.log(" failure ",err);
		} else {
			console.log("done!");
		}
		nodeOpcUAClient.disconnect(function(){});
	});
};
