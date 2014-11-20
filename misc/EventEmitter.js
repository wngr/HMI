 * Basic Testing of Events and classes
 */
// Module for inheriting
var util = require('util');

// Create global Event Emitter
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

// Create Subscription Class
function opcuaSubHandler() {
  EventEmitter.call(this);
  this.subscription = 1337;
  this.item = '123';
}
// Needs to inherit Events
util.inherits(opcuaSubHandler, EventEmitter);

opcuaSubHandler.prototype.countMonitoredItems = function(){
  return this.item.length;
};


// - class end

// Testing
var o = new opcuaSubHandler();
console.log(o.item);
console.log(o.countMonitoredItems());

o.on('test1', function(data){
  console.log(data);
});
o.on('test1', function(data){
  console.log('2nd',data);
});


o.emit('test1','boooojah');
o.emit('test1','boooojahasdfasdfasdf');

o.on('test1', function(data){
  console.log('3rd',data);
});

