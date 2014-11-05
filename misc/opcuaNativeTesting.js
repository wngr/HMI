/*
 * 
 */

var opcua = require("node-opcua");
var async = require("async");
var _ = require("underscore");

var client = new opcua.OPCUAClient();

var endpointUrl = "opc.tcp://localhost:4334";
var endpointUrl = "opc.tcp://192.168.175.209:4840";

var the_session = null;
async.series([
    // step 1 : connect to
    function(callback)  {
        client.connect(endpointUrl, function(err) {
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
//    
    function(callback){
      nodesToWrite = [ {
        nodeId : 'ns=4;s=MI5.Order[0].RecipeID',
        attributeId : 13,
        value : new opcua.DataValue({
          value : new opcua.Variant({
            dataType : opcua.DataType.Int16,
            value : 11
          })
        })
      } ];
      console.log(JSON.stringify(nodesToWrite,null,1));
      the_session.write(nodesToWrite, function(err){
        console.log(err);
        callback(err);
      });
    },
    
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

