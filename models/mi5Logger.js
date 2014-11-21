/**
 * Looger Class
 * 
 * @returns
 */
var fs = require('fs');
var moment = require('moment');

logger = function() {
  this.path = './app.log';

  console.log('OK - Logger started');
};
exports.logger = new logger();

/**
 * initialize maintenance module opcua connection
 * 
 * @param callback
 */
logger.prototype.startUp = function() {
  var self = this;

  self.append('STARTUP - app.js launched ===========================');
};

logger.prototype.append = function(message) {
  var self = this;

  fs.appendFile(self.path, moment().format() + ' - ' + message + "\n", function(err) {
    if (err) {
      console.log(err);
    }
  });
}