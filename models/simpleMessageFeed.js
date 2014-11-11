/**
 * MessageFeed Interface
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAMessageFeed);
var jadeH = require('./../models/simpleJadeHelper');

/**
 * Subscribe and monitor all messageFeed entries
 * 
 * @async
 * @param callback(err,
 *          feed)
 */
function createMonitoredItems(callback) {
  var nodeIds = [];

  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    opc.mi5Subscribe(); // MessageFeed Subscription

    for (var i = 0; i <= 100; i++) {
      nodeIds[i] = 'MI5.MessageFeed[' + i + '].';
    }

    nodeIds.forEach(function(nodeId) {
      var curNode = opc.mi5Monitor(nodeId + 'ID');
      curNode.on("changed", function(data) {
        // console.log(nodeId, data.value.value); //debug
        _readMessageEntry(nodeId)
      });
    });

    callback(err, nodeIds);
  }); // end opc.initialize()

}
exports.createMonitoredItems = createMonitoredItems;

function _readMessageEntry(baseNode) {
  opc.mi5ReadArray(opc._structMessageFeed(baseNode), function(err, data) {
    jadeData = jadeH.convertMi5ReadArrayMessageFeed(data);
    if (err) {
      console.log(err);
      return 0;
    }

    if (jadeData) {
      // only do something if ID != 0
      if (jadeData.ID.value != 0) {
        // console.log(jadeData);
        IO.emit('messageFeed', jadeData);
      }
    }

  });
}