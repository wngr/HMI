/**
 * MessageFeed Controller
 * 
 * @author Thomas Frei
 */
function service() {

  mMessageFeed.createMonitoredItems(function(err, feed) {
    if (!err) {
      console.log('Event listeners on all MessageFeed entries created');
    } else {
      console.log(err);
    }
  });

}
exports.service = service;
