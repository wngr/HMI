	var opcua = require("node-opcua");

	//create a new opcServer
	var opcServer = new opcua.OPCUAServer({
		// the port of the listening socket of the server is defined here
		port:4334
	});

	//set additional info about the server; in specific: buildInfo
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

			//let the variable1 count upwards every 1000 ms 
			//and print out the new value in the sample_server command line
			setInterval(function(){
				variable1+=1;
				//console.log("nodeVariable1.value.value: " + opcServer.nodeVariable1.value.value);
			}, 1000);

			//read a single node. returns the datavalue object. 
			//is there to see how it looks like. Has no other function
			//var dataValue = server.engine.readSingleNode("s=first_variable",13);
			//console.log("server.readSingleNode: \n " + dataValue);
			
			//add another variable to display the available_memory
			var variable2 = 10.0;
			opcServer.nodeVariable2 = opcServer.engine.addVariableInFolder("MyFolder",{
				nodeId: "ns=4;b=1020FFAA", // some opaque NodeId in namespace 4
				browseName: "MyVariable2",
				dataType: "Double",
				value: {
					get: function () {
						return new opcua.Variant({
							dataType: opcua.DataType.Double,
							value: variable2
						});
					},
					set: function (variant) {
						//parses a string into a floating point number
						variable2 = parseFloat(variant.value);
						return opcua.StatusCodes.Good;
					}
				}
			});

			//provides a few basic operating-system related utility functions
			var os = require("os");
			
			//returns the percentage of free memory on the running machine
			//@return {double}
			function available_memory() {
				// var value = process.memoryUsage().heapUsed / 1000000;
				var percentageMemUsed = os.freemem() / os.totalmem() * 100.0;
				return percentageMemUsed;
			}
			console.log("available memory: "+available_memory());


			opcServer.nodeVariable3 = opcServer.engine.addVariableInFolder("MyFolder", {
				nodeId: "ns=4;s=free_memory",// a string nodeID
				browseName: "FreeMemory",
				dataType: "Double",
				value: {
					get: function () {
						return new opcua.Variant({
							dataType: opcua.DataType.Double,
							value: available_memory()
						});
					}
				}
			});
		}
		
		//actually construct the address space
		construct_my_address_space(opcServer);

		//start the server. Function start() is asynchronous
		opcServer.start(function() {
			console.log("Server is now listening ... ( press CTRL+C to stop)");
			console.log("port ", opcServer.endpoints[0].port);
			//_"display endpoint url"
		});
		//display endpoint url
		var endpointUrl = opcServer.endpoints[0].endpointDescription().endpointUrl;
		console.log(" the primary server endpoint url is ", endpointUrl );
	}
	//initialize the opcServer and call the function post_initialize on the callback
	opcServer.initialize(post_initialize);


