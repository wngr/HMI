	var opcua = require("node-opcua");
	
	//create a new opcServer
	var opcServer = new opcua.OPCUAServer({
		// the port of the listening socket of the server is defined here
		port:4334
	});
	
	///set additional info about the server; in specific: buildInfo
	opcServer.buildInfo.productName = "OpcUAServer";
	opcServer.buildInfo.buildNumber = "7658";
	opcServer.buildInfo.buildDate = new Date(2014,09,15);
	
	//create the callback function, which is called after the initialization process
	function post_initialize(){
		console.log("initialized");
	    
		//create the function to create sample folders and variables
		function construct_my_address_space(opcServer){
			
			//create the sample folder called MyFolder
			opcServer.engine.createFolder("RootFolder",{browseName: "MyFolder"});
	
			//add variables in folders
			
			var variable1 = 0;
			//add a variable named MyVariable1 to the newly created folder "MyFolder"
			//read the variable and save the value in a new variable called MyVariable1
			opcServer.nodeVariable1 = opcServer.engine.addVariableInFolder("MyFolder",{
				//nodeId: "ns=4; b=first_variable",
				nodeId: "s=first_variable",
				browseName: "MyVariable1",
				dataType: "Double",
				value: {
					//sets the value to the value of variable1. Constantly checks if the value is still variable1.
					//If not the value is updated to the latest value of variable1
					get: function () {
						return new opcua.Variant({
							dataType: opcua.DataType.Double,
							value: variable1 });
						},
					//without 'set:' the variable wont be changeable
					set: function (variant) {
						//parses a string into a floating point number
						variable1 = parseFloat(variant.value);
						return opcua.StatusCodes.Good;
					}
				}
			});
	
			//indicates that the server is still listening
			setInterval(function(){
				console.log("server is still listening...");
			}, 10000);
		}
		
		//actually construct the address space
		construct_my_address_space(opcServer);
	
		//start the server. Function start() is asynchronous
		opcServer.start(function() {
			console.log("Server is now listening ... ( press CTRL+C to stop)");
			console.log("port ", opcServer.endpoints[0].port);
		});
		//display endpoint url
		var endpointUrl = opcServer.endpoints[0].endpointDescription().endpointUrl;
		console.log(" the primary server endpoint url is ", endpointUrl );
	}
	//initialize the opcServer and call the function post_initialize on the callback
	opcServer.initialize(post_initialize);

