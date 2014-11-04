/*
 * 
 */

var opcua = require("node-opcua");
var async = require("async");
var _ = require("underscore");

var client = new opcua.OPCUAClient();

var endpointUrl = "opc.tcp://localhost:4334";

var the_session = null;
async.series([
    // step 1 : connect to
    function(callback)  {
        client.connect(endpointUrl,function (err) {
            if(err) {
                console.log(" cannot connect to endpoint :" , endpointUrl );
            } else {
                console.log("connected !");
            }
            callback(err);
        });
    },
    // step 2 : createSession
    function(callback) {
        client.createSession( function(err,session) {
            if(!err) {
                the_session = session;
            }
            callback(err);
        });

    },
    
    // write object / array
    function(callback){
      var baseNode = 'ns=4;s=MI5.Module1101.Output.SkillOutput.SkillOutput0.';
      
      function createNodeArrayEntry(baseNode, nodeIdSuffix, value){
      nodesToWrite = [ {
      nodeId : basenode+'Busy',
      attributeId : 13,
      value : new opcua.DataValue({
        value : new opcua.Variant({
          dataType : opcua.DataType.Double,
          value : 1
        })
      })
    } ];       
      }
      
      var order = {
          Name : 'Schnaps',
          Description : 'Special Order for Thomas Frei',
          RecipeID : 12,
          TaskID : 1337,
          Parameters : [{value: 12}, {value: 14}]
        };
      
      _.keys(order).forEach(function(name){
        if(_.isNumber(order[name])){
          console.log('number');
        } else if (_.isArray(order[name])){
          console.log('array');
        }else if (_.isString(order[name])){
          console.log('string');
        }
      });
      
//      nodesToWrite = [ {
//        nodeId : basenode+'Busy',
//        attributeId : 13,
//        value : new opcua.DataValue({
//          value : new opcua.Variant({
//            dataType : opcua.DataType.Double,
//            value : 1
//          })
//        })
//      } ];
//
//      the_session.write(nodesToWrite, callback);
    },
    // step 3 : browse
//    function(callback) {
//
//        the_session.browse("RootFolder", function(err,browse_result,diagnostics){
//            if(!err) {
//                browse_result[0].references.forEach(function(reference) {
//                    console.log( reference.browseName);
//                });
//            }
//            callback(err);
//        });
//    },
    // step 4 : read a variable
//    function(callback) {
//        the_session.readVariableValue("ns=2;s=Furnace_1.Temperature", function(err,dataValues,diagnostics) {
//            if (!err) {
//                console.log(" temperature = " , dataValues[0].value.value);
//            }
//            callback(err);
//        })
//    },

    // step 5: install a subscription and monitored item
    //
    // -----------------------------------------
    // create subscription
//    function(callback) {
//
//        the_subscription=new opcua.ClientSubscription(the_session,{
//            requestedPublishingInterval: 1000,
//            requestedLifetimeCount: 10,
//            requestedMaxKeepAliveCount: 2,
//            maxNotificationsPerPublish: 10,
//            publishingEnabled: true,
//            priority: 10
//        });
//        the_subscription.on("started",function(){
//            console.log("subscription started for 2 seconds - subscriptionId=",the_subscription.subscriptionId);
//        }).on("keepalive",function(){
//            console.log("keepalive");
//        }).on("terminated",function(){
//            callback();
//        });
//        setTimeout(function(){
//            the_subscription.terminate();
//        },10000);
//
//
//        // install monitored item
//        //
//        var monitoredItem  = the_subscription.monitor({
//            nodeId: opcua.resolveNodeId("ns=2;s=Furnace_1.Temperature"),
//            attributeId: 13
//          //, dataEncoding: { namespaceIndex: 0, name:null }
//        },
//        { 
//            samplingInterval: 100,
//            discardOldest: true,
//            queueSize: 10 
//        });
//        console.log("-------------------------------------");
//
//        // subscription.on("item_added",function(monitoredItem){
//        //xx monitoredItem.on("initialized",function(){ });
//        //xx monitoredItem.on("terminated",function(value){ });
//        
//
//        monitoredItem.on("changed",function(value){
//           console.log(" New Value = ",value.toString());
//        });
//
//    },

    // ------------------------------------------------
    // closing session
    //
    function(callback) {
        console.log(" closing session");
        the_session.close(function(err){

            console.log(" session closed");
            callback();
        });
    },


],
    function(err) {
        if (err) {
            console.log(" failure ",err);
        } else {
            console.log("done!")
        }
        client.disconnect(function(){});
    }) ;

