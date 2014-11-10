/**
 * MessageFeed Interface
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-03
 */
var opcH = require('./simpleOpcuaHelper');
var jadeH = require('./simpleJadeHelper');
var opcuaDataStructure = require('./opcuaDataStructure');

function subscribeMessageFeed(recipeIdArray, callback) {
  var opc = require('./../models/simpleOpcua').server(CONFIG.OPCUAMessageFeed);

  opc.initialize(function(err) {
    if (err) {
      console.log(err);
      callback(err);
      return 0;
    }

    opc.mi5Subscribe(); // MessageFeed Subscription
    var feed = [];
    for (var i = 0; i <= 100; i++) {
      feed[i] = opc.mi5Monitor('MI5.MessageFeed[' + i + '].ID');
      feed[i].on('changed', function(data) {
        console.log('MessageFeed' + i);
      }); // end queue.on
    }
  }); // end opc.initialize()

}
exports.subscribeMessageFeed = subscribeMessageFeed;