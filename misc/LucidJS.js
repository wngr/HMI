/** 
/** 
 * Basic Testing of Events and classes
 */
// Module for inheriting
var util = require('util');

// Lucid JS
var lucidJS = require('lucidjs');
var lucid = new lucidJS.EventEmitter();

lucid.flag('das ist ein event', 'aha','oho');
console.log('just kidding');
lucid.bind('das ist ein event', function(foo, bar){
  console.log(foo, bar);
})