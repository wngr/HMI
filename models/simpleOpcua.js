/**
 * OPC UA Model simplified
 * 
 * @author Thomas Frei
 * @date 2014-11-04
 */

exports.server = function(endPointUrl) {

  var nodeopcua = require("node-opcua");
  var util = require("util");
  var events = require("events");
  var async = require("async");
  var md5 = require("md5");

  /*
   * OpcUA object to handle scope-issues of nested cb calls
   */
  var opcua;

  // Define opc(totype) function as a class (using util.js)
  opc = (function() {
    // ctor
    function opc() {
      this.opcuaObject = 1;
      this.client = undefined;
      this.session = undefined;
      this.subscription = undefined;
    }

    opc.prototype = {
      constructor : opc,

      initialize : function(initializeCallback) {

        this.client = new nodeopcua.OPCUAClient();
        async.series([ function(callback) {
          opcua.client.connect(endPointUrl, callback);
        }, function(callback) {
          opcua.client.createSession(function(err, session) {
            opcua.session = session;
            callback();
          });
        } ], initializeCallback);
      },

      /**
       * Disconnect
       * 
       * @async
       */
      disconnect : function(callback) {
        if (callback) {
          opcua.client.disconnect(callback);
        } else {
          opcua.client.disconnect(function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      },

      /**
       * Create subscription
       * 
       * @async
       * @param callback
       */
      mi5Subscribe : function() {
        var subscriptionSettings = {
          requestedPublishingInterval : 1000,
          // requestedLifetimeCount : 100, // 10
          requestedMaxKeepAliveCount : 10, // 2
          maxNotificationsPerPublish : 10,
          publishingEnabled : true,
          priority : 10
        };
        this.subscription = new nodeopcua.ClientSubscription(this.session, subscriptionSettings);

        this.subscription.on("started", function() {
          console.log("SUBS: subscription started - subscriptionId=",
              opcua.subscription.subscriptionId);
        });
        this.subscription.on("keepalive", function() {
          // console.log('SUBS: keepalive');
        }).on("terminated", function() {
          console.log('SUBS: terminated');
        });
      },

      /**
       * Add a monitored item. Gives back object for monitored item (with event listeners)
       * 
       * @param nodeIdToMonitor
       *          (e.g. MI5.MessageFeed.MessageFeed[1])
       * @return Object
       */
      mi5Monitor : function(nodeIdToMonitor) {
        nodeIdToMonitor = opcua._checkNodeId(nodeIdToMonitor);

        var itemToMonitor = {
          nodeId : nodeopcua.resolveNodeId(nodeIdToMonitor),
          attributeId : 13
        };
        var requestedParameters = {
          samplingInterval : 100,
          discardOldest : true,
          queueSize : 10
        };
        var timestampToReturn = nodeopcua.read_service.TimestampsToReturn.Both;

        var monitoredNode = this.subscription.monitor(itemToMonitor, requestedParameters,
            timestampToReturn);

        return monitoredNode;
      },

      /**
       * Read an array with custom callback function
       * 
       * @async
       */
      mi5ReadArray : function(nodeIdArrayToRead, callback) {
        var max_age = 0, nodes = opcua._addNamespaceAndAttributeIdToNodeId(nodeIdArrayToRead);
        // console.log('OK - ReadArray Called');
        opcua.session.read(nodes, max_age, function(err, nodes, results) {
          var tempData = opcua._concatNodesAndResults(nodes, results);
          tempData = opcua._addEventsAndIdsToResultsArray(tempData);
          tempData = opcua._addNameToResultsArray(tempData);

          callback(err, tempData);
        });
      },

      /**
       * Writes a whole Object to OPC UA
       * 
       * Accepts objects with nested Arrays
       * 
       * @async
       * @param baseNode
       *          (e.g. 'MI5.Queue.Queu.0')
       * @param objectToWrite
       *          (e.g. {Name: 'Schnaps', UserParameter: [10, 20]})
       * @param callback
       */
      mi5WriteObject : function(baseNode, objectToWrite, callback) {
        var nodeDataArray = opcua._convertObjectToNodeDataArray(baseNode, objectToWrite);
        opcua.session.write(nodeDataArray, callback);
      },

      /**
       * convert an Object with one dimension of nested arrays to the NodeDataArray
       * 
       * ``` var baseNode = 'ns=4;s=MI5.Queue.Queue0.'; var object = { Name : 'Schnaps', Description :
       * 'Special Order for Thomas Frei', RecipeID : 12, TaskID : 1337, Parameters : [ { value : 12 }, {
       * value : 14 } ] }; ```
       * 
       * @needs opcua-Object
       * 
       * @param baseNode
       *          (e.g. 'MI5.Queue.Queue0')
       * @param object
       * @returns {Array}
       */
      _convertObjectToNodeDataArray : function(baseNode, dataObject) {
        var nodeDataArray = new Array;

        baseNode = opcua._checkBaseNode(baseNode);

        // Help Function for data-structure of NodeDataArrayEntry
        function thisCreateNodeArrayEntry(baseNode, nodeIdSuffix, value) {
          if (!isNaN(value)) { // is not a numeric, so if it is a numeric:
            var type = nodeopcua.DataType.Double;
            value = parseInt(value);
          } else if (_.isString(value)) {
            var type = nodeopcua.DataType.String;
          } else {
            console.log('ERR - no Datatype recognized:', value);
          }

          // NodeDataArrayEntry structure
          nodeData = {
            nodeId : baseNode + nodeIdSuffix,
            attributeId : 13,
            value : new nodeopcua.DataValue({
              value : new nodeopcua.Variant({
                dataType : type,
                value : value
              })
            })
          };

          return nodeData;
        }

        // loop over the elements in the given object
        _.keys(dataObject).forEach(
            function(name) {
              if (_.isArray(dataObject[name])) {
                // Loop over elements and adapt the baseNode and NodeSuffix to react to array
                // structure
                // on OPC UA
                dataObject[name].forEach(function(value, key) {
                  // value (e.g. [{value: 1, busy: 0}]
                  _.keys(value).forEach(
                      // looping over ['value','busy']
                      function(name2) { // name2 (e.g. value, busy)
                        tempEntry = thisCreateNodeArrayEntry(baseNode + name + "." + name + key
                            + ".", name2, value[name2]); // value[name2] (e.g. 1,0)
                      });
                  nodeDataArray.push(tempEntry);
                });
              } else {
                tempEntry = thisCreateNodeArrayEntry(baseNode, name, dataObject[name]);
                nodeDataArray.push(tempEntry);
              }
            });

        // console.log(JSON.stringify(nodeDataArray, null, 1));
        return nodeDataArray;
      },

      /**
       * Adds node-opcua specific nodes values: {nodeId} --> {nodeId: 'ns=4;s='+node, attributeId:
       * 13}
       * 
       * @param nodeIdArrayToRead
       *          array
       * @returns array
       */
      _addNamespaceAndAttributeIdToNodeId : function(nodeIdArrayToRead) {
        var output = _.map(nodeIdArrayToRead, function(node) {
          return {
            nodeId : opcua._checkNodeId(node),
            attributeId : 13
          };
        });
        return output;
      },

      /**
       * Check baseNode and adds stuff if necessary
       * 
       * @accepts 'MI5.Queue.Queue0.', 'ns=4;s=MI5.Queue.Queue0'
       * @param baseNode
       * @returns {String}
       */
      _checkBaseNode : function(baseNode) {
        // add . at the end if missing
        if (baseNode.slice(-1) != '.') {
          baseNode = baseNode + '.';
        }

        // check for namespace and node-identifier
        if (baseNode.slice(0, 7) != 'ns=4;s=') {
          baseNode = 'ns=4;s=' + baseNode;
        }

        return baseNode;
      },

      /**
       * Check NodeId and adds / removes stuff if necessary
       * 
       * @accepts 'MI5.Queue.Queue0.', 'ns=4;s=MI5.Queue.Queue0'
       * @param baseNode
       * @returns {String}
       */
      _checkNodeId : function(baseNode) {
        // add . at the end if missing
        if (baseNode.slice(-1) == '.') {
          baseNode = baseNode.slice(0, -1);
        }

        // check for namespace and node-identifier
        if (baseNode.slice(0, 7) != 'ns=4;s=') {
          baseNode = 'ns=4;s=' + baseNode;
        }

        return baseNode;
      },

      /*********************************************************************************************
       * Helper methods below
       */

      /**
       * Combines nodes and results to one data array with the structure:
       * [{"nodeId":"MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy", "value":0}, {...}, {...}]
       * 
       * @param nodes :
       *          nodeId
       * @param results :
       *          value
       * @returns {Array}
       */
      _concatNodesAndResults : function(nodes, results) {
        var output = new Array;
        for (var i = 0; i <= nodes.length; i++) {
          if (nodes[i] != undefined && results[i] != undefined) {
            // Check for BadNodeId (value: null, then statusCode)
            // console.log(nodes[i]);
            // console.log(results[i]);
            if (_.isEmpty(results[i].value)) {
              output[i] = {
                nodeId : nodes[i].nodeId.value,
                value : results[i].statusCode.description
              };
            } else {
              output[i] = {
                nodeId : nodes[i].nodeId.value,
                value : results[i].value.value
              };
            }
          }
        }
        return output;
      },

      /**
       * Add object attributes to results array accodring to nodeId in results {nodeId, value} -->
       * {nodeId, value, submitEvent, updateEvent, containerId}
       * 
       * @param data
       * @returns {Array}
       */
      _addEventsAndIdsToResultsArray : function(data) {
        var output = new Array;
        // Add new attributes to the object of every array entry
        output = _.map(data, function(entry) {
          var eventObject = {
            submitEvent : 'submitEv' + opcua._convertNodeIdToEvent(entry.nodeId),
            updateEvent : 'updateEv' + opcua._convertNodeIdToEvent(entry.nodeId),
            containerId : opcua._convertNodeIdToContainerId(entry.nodeId)
          };
          return _.extend(entry, eventObject);
        });
        return output;
      },

      /**
       * 
       */
      _addNameToResultsArray : function(data) {
        var output = new Array;
        // Find .AlphaNumeric beginning from end of line, then the points needs to be sliced away.
        var exp = /\.\w*$/
        // Add new attributes to the object of every array entry
        output = _.map(data, function(entry) {
          var eventObject = {
            name : entry.nodeId.match(exp)[0].slice(1)
          };
          return _.extend(entry, eventObject);
        });
        return output;
      },

      /**
       * Transforms a nodeId to a uniqueEvent ID
       * 
       * @param nodeId
       *          (e.g. MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy)
       */
      _convertNodeIdToEvent : function(nodeId) {
        // var output = nodeId.slice(-8)
        // output = _.uniqueId(output);
        //
        // return output;
        return nodeId; // test for session
      },

      /**
       * Converts nodeId to MD5 hash, so that it is container-id compatible id at thebeginning
       * necessary, if md5 should start with a digit
       * 
       * @param nodeId
       * @returns idFKDJ48238fhFak1
       */
      _convertNodeIdToContainerId : function(nodeId) {
        // return _.uniqueId('id' + md5(nodeId).slice(3, 10));
        return 'id' + md5(nodeId);
      },

    };

    return opc;
  }());

  /*
   * Inherit the EventEmitter methods like .emit(), .on(), ...s
   */
  opc.prototype.__proto__ = events.EventEmitter.prototype; // __proto__ is deprecated, but
  // shouldn't be a problem.

  /*
   * Check head of this file - needed for scope issues
   */
  opcua = new opc();
  return opcua;
}; // end: exports.server()
