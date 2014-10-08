/*
 * Load node-opcua module
 */

var opcua = require("node-opcua");
var async = require("async");

//create new client
var client = new opcua.OPCUAClient();

//the opcua server has to run under this Url:
var endpointUrl = "opc.tcp://localhost:4334/UA/SampleServer";
// Session for opcua create session
var the_session;
// Subscription
var the_subscription;

/*
 * Define global functions to read and write, according to Beta03
 */
//read the value of the value of the given nodeId and displays it in the console.
function readValue(nodeId){
	the_session.readVariableValue(nodeId, function(err,results) {
		console.log("current value of first_variable: " , results[0].value.value);
	});
}

//write the given value into the value of the value of the given node
//value to set has to be of type double
function writeValue(nodeId, newValue){
	//step1: create a new variant/dataValue which looks like the one to set
	var opcVariant = new opcua.Variant({
		dataType: opcua.DataType.Double,
		value: newValue });
	//step2: override the old dataValue from the first_variable with the new
	the_session.writeSingleNode(
		opcua.resolveNodeId(nodeId),
		opcVariant,//dataValue
		function(err,statusCode){
			if(err){
				console.log("err: " + err);
				//console.log("statusCode: " + statusCode);
			}
		}
	);
}


/*
 * Handle OPCUA
 * calls every following function asynchronous
 */
async.series([
	//connect the client to the opcServer
    function(callback) {
        console.log(" connecting to ", endpointUrl);
        client.connect(endpointUrl,callback);
    },
    
    //create a session
    function(callback) {
        client.createSession(function (err,session){
            if (!err) {
                the_session = session;
                console.log(" session created");
            }
            callback(err);
        });
    },
    
    function(callback) {
        the_subscription=new opcua.ClientSubscription(the_session,{
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 10,
            requestedMaxKeepAliveCount: 2,
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        });
        
        the_subscription.on("started",function(){
            console.log("subscription started for 2 seconds - subscriptionId=",the_subscription.subscriptionId);
        }).on("keepalive",function(){
            console.log("keepalive");
        }).on("terminated",function(){
            callback();
        });
        
//        setTimeout(function(){
//            the_subscription.terminate();
//        },10000);
        
        // install monitored item
        var monitoredItem  = the_subscription.monitor({
            nodeId: opcua.resolveNodeId("ns=4;s=first_variable"),
            attributeId: 13
        },
        {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10
        },
        opcua.read_service.TimestampsToReturn.Both
        );
        console.log("-------------------------------------");
        
        monitoredItem.on("changed",function(dataValue){
           console.log("first_variable = ",dataValue.value.value);
        });
     }
]);

/*
 * GET opcua test page.
 */
exports.jade = function(req, res){
	
  res.render('opcua', { title: 'Express' });
};
