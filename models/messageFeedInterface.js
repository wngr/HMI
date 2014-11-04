/**
 * MessageFeedInterface
 * 
 * @author Thomas Frei
 * @date 2014-11-04
 */
var opcuaHelper = require('./opcuaHelper');
var opcuaDataStructure = require('./opcuaDataStructure');

/*
 * MessageFeed specific configuration
 */
var messageFeedSize = 100; // on server side
var messageFeedTimestampFormat = 'yyyy-MM-dd hh:mm:ss.zzzz'; // with zzzz ms at end

/***************************************************************************************************
 * Start Message Feed Module
 */
exports.listen = function() {
  opcuaMessage = require('./opcuaInstance').server(CONFIG.messageFeedUrl);

  opcuaMessage.on('ready', function() {
    opcuaMessage.subscribe();
    for (var i = 0; i <= messageFeedSize; i++) {
      console.log('Monitor for item ' + i);
      var nodeId = nodeIdMessageFeedEntry('ID', i);
      var monitoredItem = opcuaMessage.monitor(nodeId);
      monitoredItem.on('changed', function(data, additional) {

        console.log(data);
      });
    }
  });

  function readMessageEntry(entry, callback) {
    var messageEntry = [ nodeIdMessageFeedEntry('ID', entry), nodeIdMessageFeedEntry('ID', entry) ];
    opcuaMessage.readArrayCb(messageEntry, callback);
  }

  opcuaMessage.initialize();
};

function nodeIdMessageFeedEntry(node, entry) {
  return 'MI5.MessageFeed[' + entry + '].' + node;
}