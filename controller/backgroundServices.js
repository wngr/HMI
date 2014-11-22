/**
 * Handle and execute background services
 * 
 * @author Thomas Frei
 * @date 2014-11-14
 */

// Message Feed
var messageFeed = require('./backgroundMessageFeed').service();

// Time
var serverTime = require('./backgroundTime.js').service();

// Debug
var debug = require('./backgroundDebug.js').service();
