/**
 * Configuration
 */
GLOBAL.CONFIG = require('./../config.js');

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path'), express = require('express'), app = express(), http = require('http'), server = http
    .createServer(app);

GLOBAL.IO = require('socket.io').listen(server);
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');

var moduleInterface = require('./../models/moduleInterface');
moduleInterface.setEndpointUrl('opc.tcp://localhost:4334/');
moduleInterface.setModule('Module1101');

// Test on how to extract the submitEvents from every single Entry (module, skill, parameter)
moduleInterface.getCompleteModuleData(function(output) {
  var subscribeThis = new Array();

  flattened = _.flatten(output);
  flattened.forEach(function(entry) {
    console.log('xxxSkillOutputxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // We get the module, and every skill
    // console.log(entry);
    _.each(entry, function(element) {
      if (element.submitEvent) {
        // console.log(element.submitEvent);
        subscribeThis.push(element.submitEvent);
      } else {
        // ParameterOutput
        element.forEach(function(parameter) {
          console.log('xxxParameterOutputxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
          _.each(parameter, function(parameterEntry) {
            // console.log(parameterEntry.submitEvent);
            subscribeThis.push(parameterEntry.submitEvent);
          });
          // console.log(parameter);
        });
      }
    });
  });
  console.log(subscribeThis);
});

// moduleInterface.setSkill(1);
// var parameters = moduleInterface.getParameters(function(parameters) {
// console.log(parameters);
// });
