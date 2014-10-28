/*
 * Mocha Test Information
 * http://unitjs.com/guide/mocha.html
 */

/**
 * Configuration
 */
GLOBAL.CONFIG = require('./../config.js');

/**
 * Node-Module dependencies.
 * https://www.digitalocean.com/community/tutorials/how-to-install-express-a-node-js-framework-and-set-up-socket-io-on-a-vps
 */
var path = require('path'),
  express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  should = require('should'); // For Testing

GLOBAL.IO = require('socket.io').listen(server);
GLOBAL._ = require('underscore');
GLOBAL.md5 = require('MD5');

describe('opcuaInstance', function() {

  describe('readArray()', function() {

    var opcuaSession1 = require('./../models/opcuaInstance').server('opc.tcp://localhost:4334/');
    it('should read an Array of nodes out of a node-opcua server', function() {
      opcuaSession1.on('readArrayFinished', function(data) {
        console.log('=======================================================');
        console.log('=======================================================');
        console.log(JSON.stringify(data, null, 1));
      });

      opcuaSession1.on('ready', function() {
        var NodesToRead = ['MI5.Module1101.Output.SkillOutput.SkillOutput0.Busy',
                           'MI5.Module1101.Output.SkillOutput.SkillOutput0.Ready',
                           'MI5.Module1101.Output.SkillOutput.SkillOutput0.Done'];
        opcuaSession1.readArray(NodesToRead);

        opcuaSession1.readArray(opcuaSession1.nodeArrayParameterOutputSingle('MI5.Module1101.Output.SkillOutput.SkillOutput0.ParameterOutput', 0));
        opcuaSession1.readArray(opcuaSession1.nodeArraySkillOutputSingle('MI5.Module1101.Output.SkillOutput', 0));
      });

    });

  });

  describe('subtractOne()', function() {

    it('should correctly subtract one from the given number', function() {
      // assertions here
    });

  });

});
