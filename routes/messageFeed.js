/**
 * MessageFeed Control
 */
var messageFeed = require('./../models/simpleMessageFeed');

messageFeed.createMonitoredItems(function(err, feed) {
  if (!err) {
    console.log('Event listeners on all MessageFeed entries created');
  } else {
    console.log(err);
  }
});