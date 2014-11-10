/**
 * MessageFeed Control
 */
console.log('./routes/messageFeed.js');

var messageFeed = require('./../models/simpleMessageFeed');

messageFeed.createMonitoredItems(function(err, feed) {
  // console.log(feed[0].itemToMonitor.nodeId.value);
  // messageFeed.createChangeEvents(feed);
});