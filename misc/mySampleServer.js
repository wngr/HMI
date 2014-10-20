/**
 * Sample Server following the tutorial:
 * 
 * http://node-opcua.github.io/create_a_server.html
 * @author Thomas Frei
 */


var opcua = require("node-opcua");

var serverVars = new Array();
var localVars = new Array();

    
var server = new opcua.OPCUAServer({
  port: 4334 // the port of the listening socket of the server
});

// optional?
server.buildInfo.productName = "MySampleServer1";
server.buildInfo.buildNumber = "7658";
server.buildInfo.buildDate = new Date(2014,5,2);


function doubleOpcua(DefaultValue, Description) {
  var currentElement = localVars.length;
  localVars[currentElement] = DefaultValue;
  var newServerVar = server.engine.addVariableInFolder("MyDevice",{
    //nodeId: "ns=4;b=1020FFAA", // some opaque NodeId in namespace 4 (optional)
    browseName: Description,
    dataType: "Double",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Double, value: localVars[currentElement] });
        },
        set: function (variant) {
          localVars[currentElement] = parseFloat(variant.value);
          return opcua.StatusCodes.Good;
        }
    }
  });
  console.log('Variable ', Description, ' added');
  return newServerVar;
};
function stringOpcua(DefaultValue, Description, desiredNodeId) {
  desiredNodeId = typeof desiredNodeId !== 'undefined' ? ( 'ns=4;s=' + desiredNodeId ) : '';
  
  var currentElement = localVars.length;
  localVars[currentElement] = DefaultValue;
  var newServerVar = server.engine.addVariableInFolder("MyDevice",{
    nodeId: desiredNodeId, // some opaque NodeId in namespace 4 (optional) "ns=4s=GVL.OPCModule.Output.Skill;
    browseName: Description,
    dataType: "String",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.String, value: localVars[currentElement] });
        },
        set: function (variant) {
          localVars[currentElement] = variant.value;
          return opcua.StatusCodes.Good;
        }
    }
  });
  console.log('Variable ', Description, ' added');
  return newServerVar;
};

function doubleOpcuaVariable(variable, Description) {
  var newServerNodeVariable = server.engine.addVariableInFolder("MyDevice",{
    //nodeId: "ns=4;b=1020FFAA", // some opaque NodeId in namespace 4 (optional)
    browseName: Description,
    dataType: "Double",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Double, value: variable });
        },
        set: function (variant) {
          variable = parseFloat(variant.value);
          return opcua.StatusCodes.Good;
        }
    }
  });
  console.log('Variable ', Description, ' added');
  return newServerNodeVariable;
};
function stringOpcuaVariable(variable, Description) {
  var newServerNodeVariable = server.engine.addVariableInFolder("MyDevice",{
    //nodeId: "ns=4;b=1020FFAA", // some opaque NodeId in namespace 4 (optional)
    browseName: Description,
    dataType: "String",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.String, value: variable });
        },
        set: function (variant) {
          variable = variant.value; // comes in as a string
          return opcua.StatusCodes.Good;
        }
    }
  });
  console.log('Variable ', Description, ' added');
  return newServerNodeVariable;
};


function post_initialize() {
  console.log("initialized");
  
  function construct_my_address_space(server) {
  
    // declare some folders
    server.engine.createFolder("RootFolder",{ browseName: "MyDevice"});
  
    // add variables in folders
    
    /*
     * add a variable named MyVariable1 to the newly created folder "MyDevice"
     */
    var variable1 = 1;
    // emulate variable1 changing every 500 ms
    setInterval(function(){  variable1+=1; }, 500);
    server.nodeVariable1 = server.engine.addVariableInFolder("MyDevice",{
            browseName: "MyVariable1",
            dataType: "Double",
            value: {
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.Double, value: variable1 });
                }
            }
    });

    var variable2 = 10.0;
    server.nodeVariable2 = doubleOpcuaVariable(variable2, 'MyVariable2');
    var variable3 = 3;
    server.nodeVariable3 = doubleOpcuaVariable(variable3, 'Easy3');
    var variable4 = 4;
    server.nodeVariable4 = doubleOpcuaVariable(variable4, 'Easy4');
    
    // Add a string variable
    var stringval1 = 'hello string-world';
    server.nodeVariable5 = stringOpcuaVariable(stringval1, 'TestString');

    server.mytest = doubleOpcua(1337, 'leetDefault');
    server.karamba = doubleOpcua(31337, 'leetDefault2');
    server.a1 = stringOpcua('das ist es ', 'stringTest1');

    server.test1 = stringOpcua('1', 'ReadyState', 'wunschid');
    server.test2 = stringOpcua('1', 'Test1', 'GVL.OPCModule[1].Output.SkillOutput.SkillOutput[1].Ready');
    
    
    
  };
  
  
  
  construct_my_address_space(server);
  
  server.start(function() {
    console.log("Server is now listening ... ( press CTRL+C to stop)");
    console.log("port ", server.endpoints[0].port);
    
    var endpointUrl = server.endpoints[0].endpointDescription().endpointUrl;
    console.log(" the primary server endpoint url is ", endpointUrl );
  
  });
}
server.initialize(post_initialize);
