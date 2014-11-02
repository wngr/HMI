/**
 * Format Result from Node-OPCUA Stylish, to more object oriented style
 * 
 * Working for skills and parameters
 * 
 * @param err
 * @param nodes
 * @param results
 * @returns
 */
function formatResultToObject(err, nodes, results) {
  if (err) {
    console.log("ERR - read: " + err);
    console.log("statusCode: " + statusCode);
  } else {
    var returnData = concatNodesAndResults(nodes, results);
    returnData = addEventsAndIdsToResultsArray(returnData);
    returnData = addNameToResultsArray(returnData);
    returnData = formatNodeValueArrayToSkillContainerArray(returnData);
    return returnData;
  }
}
exports.formatResultToObject = formatResultToObject;

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
function concatNodesAndResults(nodes, results) {
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
}
exports.concatNodesAndResults = concatNodesAndResults;

/**
 * Add object attributes to results array accodring to nodeId in results {nodeId, value} -->
 * {nodeId, value, submitEvent, updateEvent, containerId}
 * 
 * @param data
 * @returns {Array}
 */
function addEventsAndIdsToResultsArray(data) {
  var output = new Array;
  // Add new attributes to the object of every array entry
  output = _.map(data, function(entry) {
    var eventObject = {
      submitEvent : 'submitEv' + convertNodeIdToEvent(entry.nodeId),
      updateEvent : 'updateEv' + convertNodeIdToEvent(entry.nodeId),
      containerId : convertNodeIdToContainerId(entry.nodeId)
    }
    return _.extend(entry, eventObject);
  });
  return output;
}
exports.addEventsAndIdsToResultsArray = addEventsAndIdsToResultsArray;

/**
 * 
 */
function addNameToResultsArray(data) {
  var output = new Array;
  // Find .AlphaNumeric beginning from end of line, then the points needs to be sliced away.
  var exp = /\.\w*$/
  // Add new attributes to the object of every array entry
  output = _.map(data, function(entry) {
    var eventObject = {
      name : entry.nodeId.match(exp)[0].slice(1)
    }
    return _.extend(entry, eventObject);
  });
  return output;
}
exports.addNameToResultsArray = addNameToResultsArray;

function formatNodeValueArrayToSkillContainerArray(data) {
  var temp = new Object; // needed for variable object-property
  // Add new attributes to the object of every array entry
  _.each(data, function(entry) {
    temp[entry.name] = entry;
  });
  return temp;
}
exports.formatNodeValueArrayToSkillContainerArray = formatNodeValueArrayToSkillContainerArray;

/**
 * Transforms a nodeId to a uniqueEvent ID
 * 
 * @param nodeId
 *          (e.g. MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy)
 */
function convertNodeIdToEvent(nodeId) {
  // var output = nodeId.slice(-8)
  // output = _.uniqueId(output);
  //
  // return output;
  return nodeId; // test for session
}
exports.convertNodeIdToEvent = convertNodeIdToEvent;

/**
 * Converts nodeId to MD5 hash, so that it is container-id compatible id at thebeginning necessary,
 * if md5 should start with a digit
 * 
 * @param nodeId
 * @returns idFKDJ48238fhFak1
 */
function convertNodeIdToContainerId(nodeId) {
  // return _.uniqueId('id' + md5(nodeId).slice(3, 10));
  return 'id' + md5(nodeId);
}
exports.convertNodeIdToContainerId = convertNodeIdToContainerId;

function formatNodeValueArrayToSkillContainerArray(data) {
  var temp = new Object; // needed for variable object-property
  // Add new attributes to the object of every array entry
  _.each(data, function(entry) {
    temp[entry.name] = entry;
  });
  return temp;
}
exports.formatNodeValueArrayToSkillContainerArray = formatNodeValueArrayToSkillContainerArray;