/**
 * Used for Model-Testing and function testing in Node
 * 
 * @author Thomas Frei
 * @date   2014-10-12 
 */

/*
 * Testing for Events and Classes.
 * 1. Define Class
 * 1.1 Define Properties
 * 1.2 Define Class-Handlers as 'reactions()'
 * 2. Inherit Event handlers
 * 3. New Class-Object
 * 4. Register Event-Listeners // Do the Event-litsener in the class-constructor!!! (see line 30)
 * 5. Start using the class
 */
var util = require("util");
var events = require("events");

// 1.
FamilyMember = (function() {
  function FamilyMember() {
    this.name = 'Max';
    this.lastname = 'Mustermann';
    this.age = '0';
    
    this.immediateReactions();
    
    events.EventEmitter.call(this);
  }

  FamilyMember.prototype = {
    constructor: FamilyMember,
    giveBirth: function(name, lastname) {
      this.name = name ? name : this.name;
      this.lastname = lastname ? lastname : this.lastname;
      this.age = 0;
      
      this.emit('born', this );
    },
    die: function(){
      this.lastname = this.lastname + ' RIP ';
      this.emit('died', this);
    },
    immediateReactions: function(){
//      this.on('born', function(){ console.log('The Child is out!'); });
//      this.on('died', function(){ console.log(this.name + ' ' + this.lastname + ' no longer is with us.')});
    }
  };

  return FamilyMember;
}());

// 2.
FamilyMember.prototype.__proto__ = events.EventEmitter.prototype;

// 3.
//Frei = new FamilyMember();

// 4.
//Frei.on('born', function(msg){ console.log('I heard a ' + msg + ' was born!'); } );

//5.
//Frei.giveBirth('Carina', 'Frei');

module.exports = new FamilyMember();
setTimeout(function(){
  module.exports.emit('birth', 'Birthday!');  
}, 10000);












