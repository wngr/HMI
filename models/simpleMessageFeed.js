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
  _emitMessageFeedBadge();

  console.log('OK - MessageFeed -Initial - IO.emit()');
}
exports.emitMessageFeedInitial = emitMessageFeedInitial;

/**
 * Performs a read, on a designated MessageFeed entry
 * 
 * Check the MessageFeed Entry if there is a maintenance or a manual module task
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
        // Check for maintenance or manual module
        console.log(jadeData.Level.value);

        if (_isSpecialMessage(jadeData)) {
          _handleSpecialMessages(jadeData);
          console.log('OK - SpecialMessage - ', jadeData.Message.value);
        } else {
          _pushMessage(jadeData);
          _emitMessageFeedArray('messageFeedPanel', 15);
          _emitMessageFeedArray('messageFeedArray', 5);
          _emitMessageFeedArray('messageFeedSingle', 1);
          _emitMessageFeedBadge();
          console.log('OK - MessageFeed - IO.emit() - Level: ',
              jadeData.Level.value);
        }

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

  messageFeedArray.unshift(message); // unshift adds element at the top of the
  // array

  console.log('OK - MessageFeed - New Message from ProcessTool:',
      message.Message.value, message.Timestamp.value);
}

/**
 * Emit whole Message Feed Array (not used yet)
 * 
 * @async
 * @param numbeROfEntries
 *          <mixed> (options: #number, 'complete')
 */
function _emitMessageFeedArray(eventName, numberOfEntries) {
  numberOfEntries = typeof numberOfEntries !== 'undefined' ? numberOfEntries
      : 5; // default: 5

  IO.emit(eventName, _.first(messageFeedArray, numberOfEntries));
}

function _emitMessageFeedBadge() {
  var size = messageFeedArray.length;
  IO.emit("messageFeedBadge", size % 100);
}

function _isSpecialMessage(jadeData) {
  var level = parseInt(jadeData.Level.value);
  if (jadeData.Level.value >= 100) {
    return true;
  } else {
    return false;
  }
}

function _handleSpecialMessages(jadeData) {
  var level = parseInt(jadeData.Level.value);
  // Manual Module (level==100)
  if (level == 100) {
    IO.emit('manualBadge', 1);
  }
  if (level == 101) {
    IO.emit('maintenanceBadge', 1);
  }
  if (level == 102) {
    IO.emit('inputBadge', 1);
  }
  if (level == 103) {
    IO.emit('outputBadge', 1);
  }

}