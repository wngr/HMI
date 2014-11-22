/**
 * Send Time Events to the Browser
 * 
 * @author Thomas Frei
 * @date 2014-11-14
 */

/**
 * work()-Function is executed by backgroundServices.js
 * 
 * @constructor
 */
function service() {
  serverTime();
}
exports.service = service;

/**
 * Sends time Object to the Browser, needed for Top-Navigation
 */
function serverTime() {
  setInterval(function() {
    var now = moment();
    var serverTime = {
      serverTime : now.format('MMMM Do YYYY, H:mm:ss'),
      serverTimeHMS : now.format('HH:mm:ss'),
      serverTimeDay : now.format('dddd'),
      serverTimeDate : now.format('MMMM Do YYYY')
    };
    IO.emit('serverTime', serverTime);
  }, 1000);
}