/**
 * Used for Model-Testing and function testing in Node
 * 
 * @author Thomas Frei
 * @date   2014-10-12 
 */

/*
 * Testing for Events and Classes.
 * 1. Define Class
 * 2. Inhreit Event handlers
 * 3. New Class-Object
 * 4. Register Event-Listeners // Do the Event-litsener in the class-constructor!!! (see line 30)
 * 5. Start using the class
 */
var util = require("util");
var events = require("events");

/*
 * Define Class
 */
MyFamily = (function() {
  function MyFamily() {
    this.name = 'Max';
    this.lastname = 'Mustermann';
    this.age = '0';
    
    this.reactions();
    
    events.EventEmitter.call(this);
  }

  MyFamily.prototype = {
    constructor: MyFamily,
    giveBirth: function(name, lastname) {
      this.name = name;
      this.lastname = lastname;
      this.age = 0
      
      msg = 'Heureka! A child was born. It may carry the name: ' + name + ' ' + lastname;
      console.log(msg);
      this.emit('born', name + ' ' + lastname );
    },
    die: function(){
      console.log(this.field + 2);
    },
    reactions: function(){
      this.on('born', function(){ console.log('The Child is out!'); });
    }
  };

  return MyFamily;
}());

// 2.
MyFamily.prototype.__proto__ = events.EventEmitter.prototype;

//3.
Frei = new MyFamily();

//4.
Frei.on('born', function(msg){ console.log('I heard a ' + msg + ' was born!'); } );

//5.
Frei.giveBirth('Carina', 'Frei');





















