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

var messageFeedArray = [];

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

function emitMessageFeedInitial() {
  _emitMessageFeedArray('messageFeedPanel', 15);
  _emitMessageFeedArray('messageFeedArray', 5);
  _emitMessageFeedArray('messageFeedSingle', 1);
}
exports.emitMessageFeedInitial = emitMessageFeedInitial;

/**
 * Performs a read, on a designated MessageFeed entry
 * 
 * @async
 * @param baseNode
 */
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
        _pushMessage(jadeData);
        _emitMessageFeedArray('messageFeedPanel', 15);
        _emitMessageFeedArray('messageFeedArray', 5);
        _emitMessageFeedArray('messageFeedSingle', 1);
      }
    }

  });
}

/**
 * Push message to top of messageFeedArray
 * 
 * @uses messageFeedArray <array>
 * @param message
 *          <object>
 */
function _pushMessage(message) {
  assert(_.isObject(message));

  messageFeedArray.unshift(message); // unshift adds element at the top of the array

  console.log('OK - MessageFeed - New Message from ProcessTool:', message.Message.value,
      message.Timestamp.value);
}

/**
 * Emit whole Message Feed Array (not used yet)
 * 
 * @async
 * @param numbeROfEntries
 *          <mixed> (options: #number, 'complete')
 */
function _emitMessageFeedArray(eventName, numberOfEntries) {
  numberOfEntries = typeof numberOfEntries !== 'undefined' ? numberOfEntries : 5; // default: 5

  IO.emit(eventName, _.first(messageFeedArray, numberOfEntries));

  console.log('OK - IO.emit()', eventName);

}