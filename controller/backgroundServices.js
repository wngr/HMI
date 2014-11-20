/**
 * Handle and execute background services
 * 
 * @author Thomas Frei
 * @date 2014-11-14
 */

// Message Feed
var messageFeed = require('./backgroundMessageFeed');
messageFeed.work();

// Time
var serverTime = require('./backgroundTime.js');
serverTime.work();

// Debug
var debug = require('./backgroundDebug.js');
debug.work();
