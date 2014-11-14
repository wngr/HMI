/**
 * New node file
 */
opc.initialize(function(err) {
  if (err) {
    console.log(err);
    return 0;
  }                    
  
  var mappingMi5DebugPendingFalse = require('./../models/simpleDataTypeMapping.js').Mi5DebugPendingFalse;
  
  var writethis = {
    Pending : true
  };
  
  opc.mi5WriteObject('MI5.Order[0].', writethis, mappingMi5DebugPendingFalse, function(err) {
      console.log('written in any case, no error available?');
      opc.disconnect();
  });

});