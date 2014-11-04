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

    var messageFeedArray = new Array;
    for (var i = 0; i <= messageFeedSize; i++) {
      messageFeedArray.push(nodeIdMessageFeedEntry('ID', i));
    }

    console.log(messageFeedArray);

    opcuaMessage.readArrayCB(messageFeedArray, function(err, nodes, results) {
      data = opcuaHelper.formatResultToObject(err, nodes, results);
      console.log(results);
      console.log(data);
    });
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
