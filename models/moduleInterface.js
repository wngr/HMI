/**
 * New node file
 */

exports.server = function(endPointUrl) {

  var nodeopcua = require("node-opcua"), util = require("util"), events = require("events"), async = require("async"),

  opcua; // handle
  // nested
  // issues

  // Define base-class-Object function as a class (using util.js)
  opcuaBase = (function() {
    // ctor
    function opcuaBase() {
      this.opcuaObject = 1;
      this.client = undefined;

      this.session = undefined;
      this.subscription = undefined;

      this.initiliazed = undefined;
      this.connected = undefined;
      this.sessionCreated = undefined;

      // Register all the inner Class-Event-Listeners. This needs to be done in
      // the ctor.
      // this.innerReactions();
    }

    opcuaBase.prototype = {
      constructor : opcuaBase,

      initialize : function() {
        console.log('initialize()');
        this.client = new nodeopcua.OPCUAClient();
        this.initialized = true;
        this.connect();
      },

      connect : function() {
        console.log('connect()');
        // isNested(this);
        // console.log( this );
        this.client.connect(endPointUrl, this.cbConnected);
      },
      cbConnected : function(err) {
        if (!err) {
          console.log('cbConnected()');
          // isNested(this);
          opcua.emit('connected');
          this.connected = true;
          opcua.createSession(); // the cb is called in this.client.connect() and in this scope,
          // the this.-object does not see the opcuaPro methods. Therefore a
          // global opcua object is needed.
        } else {
          opcua.errorHandling(err, 'Could not connect to the OPC UA Server - terminate');
          opcua.disconnect(err);
        }
      },

      createSession : function() {
        console.log('createSession()');
        this.client.createSession(function(err, session) {
          if (!err) {
            opcua.session = session;
          } else {
            opcua.errorHandling(err, 'Could not create Session');
          }
          opcua.emit('ready', opcua);
          this.sessionCreated = true;
        });
      },

      ready : function() {
        if (this.sessionCreated === true) {
          // nothing to do
          return true;
        } else if (this.connected === true) {
          ;
          // create a session
          return true;
        } else if (this.initialized === true) {
          // connect
          return true;
        } else {
          // start all over
          async.series([
          // connect the client to the opcServer
          function(callback) {
            console.log(" connecting to ", endpointUrl);
            client.connect(endpointUrl, callback);
          } ]); // end async.series
        }
      }
    };

    return opcuaBase;
  }());

  /*
   * Inherit the EventEmitter methods like .emit(), .on(), ...s
   */
  opcuaBase.prototype.__proto__ = events.EventEmitter.prototype; // __proto__ is deprecated, but
  // shouldnt be a prolem

  /*
   * Check head of this file - needed for scope issues
   */
  opcua = new opcuaBase();
  return opcua;
}; // end: exports.createServer()
