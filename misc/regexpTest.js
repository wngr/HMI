/**
 * Test regular Expressions

 */
var _ = require('underscore');

var re = /\w+\s/g;
var str = "fee fi fo fum";
var myArray = str.match(re);
console.log(myArray);

var exp = /\.\w*$/
var nodeId = 'MI5.Module1101.Output.SkillOutput.SkillOutput13.Error';

console.log( exp.exec(nodeId) );
console.log( nodeId.match(exp) );

console.log( nodeId.match(exp)[0].slice(1) );

function getSkillNumber(nodeId) {
  var exp = /(?:SkillOutput)([0-9]+)\./
  return nodeId.match(exp)[1];
}

console.log(getSkillNumber(nodeId));

console.log(str.slice(-1));


var baseNode = 'ns=4;s=MI5.Module1101.Output.SkillOutput';
console.log(baseNode.slice(0,7));



var nodeId = 'MI5.Recipe[0].Name';
  var exp = /(?:Recipe\[)([0-9]+)\]/
    console.log(nodeId.match(exp));

console.log('find find find ');

/*
 * Test for new array structure
 */
function splitNodeId(nodeId){
  var exp = /\w*\[?[0-9]*\]?/g
  var result = nodeId.match(exp);
  result = _.compact(result);
  return result;
}
var nodeId = 'MI5.Recipe[0].UserParameter[0].Name';
var result = splitNodeId(nodeId);
console.log(result);

// detect if array:
function detectIfArray(node){
  var exp = /\[([0-9]+)\]/
  if (node.match(exp)){
    return true;
  } else {
    return false;
  }
}

function detectArrayElement(node){
  if(detectIfArray(node)){
    var exp = /\[([0-9]+)\]/
    var match = node.match(exp);
    return match[1];
  }
  else {
    return false;
  }
}

//detect if array:
function stripArray(node){
var exp = /\w*/
var result = node.match(exp);
return result[0];
}
//detect if array:
function stripArrayKey(node){
  var exp = /([0-9]+)/
  var result = node.match(exp);
  return result[1];
}

console.log('es sollte', stripArrayKey('Test[4]'));

console.log('))))))))))))))))))))))))))))))))))))))');
console.log('))))))))))))))))))))))))))))))))))))))');
console.log('))))))))))))))))))))))))))))))))))))))');

console.log(_.map(result, function(item){ return detectIfArray(item); }));
console.log(_.map(result, function(item){ return detectArrayElement(item); }));
console.log(_.map(result, function(item){ return stripArray(item); }));


// Create object array out of 
array = [ 'MI5', 'Recipe[0]', 'UserParameter[5]', 'Unit' ];
var obj = new Object;
for (var i = 0; i <= array.length; i++){  
  if (i == 0) {    
    obj[array[i]] = {};
    console.log(obj);
  }
  if (i == 1) {
    /*
     *if Array, we create object again: Recipe[0] -- Recipe : [{}, {}, {}]
     */ 
    if (detectArrayElement(array[i])) {
      var newObject = stripArray(array[1]);
      obj[array[0]] = [1];
    } else {
      console.log('no');
    }
    
  }
}

console.log('))))))))))))))))))))))))))))))))))))))');
var test = _.groupBy(array, function(item){
  // Detect if Array:
  if(detectArrayElement(item)){
    return stripArray(item);
  }
  return item; 
});
console.log(test);

/*Test*/
var test = [ { nodeId: 'MI5.Recipe[0].Description',
  value: '%Description of the Recipe e.g. "a recipe, that produces a product with feature x"',
  submitEvent: 'submitEvMI5.Recipe[0].Description',
  updateEvent: 'updateEvMI5.Recipe[0].Description',
  containerId: 'ide93007221552736f6767ebc4343f55e7' },
{ nodeId: 'MI5.Recipe[0].Dummy',
  value: true,
  submitEvent: 'submitEvMI5.Recipe[0].Dummy',
  updateEvent: 'updateEvMI5.Recipe[0].Dummy',
  containerId: 'id1fd1531cd1cf48501b43bdc729512993' },
{ nodeId: 'MI5.Recipe[0].Name',
  value: 'e.g. Product x',
  submitEvent: 'submitEvMI5.Recipe[0].Name',
  updateEvent: 'updateEvMI5.Recipe[0].Name',
  containerId: 'id09aecbc3635f369edebad3197daaab6c' },
{ nodeId: 'MI5.Recipe[0].RecipeID',
  value: 0,
  submitEvent: 'submitEvMI5.Recipe[0].RecipeID',
  updateEvent: 'updateEvMI5.Recipe[0].RecipeID',
  containerId: 'id6cc3c4529b5d8df7081a08eeecad0c55' },
{ nodeId: 'MI5.Recipe[0].UserParameter[0].Default',
  value: 0,
  submitEvent: 'submitEvMI5.Recipe[0].UserParameter[0].Default',
  updateEvent: 'updateEvMI5.Recipe[0].UserParameter[0].Default',
  containerId: 'id2393a1d0030b1d274262f1fd25c83677' },
{ nodeId: 'MI5.Recipe[0].UserParameter[0].Description',
  value: '',
  submitEvent: 'submitEvMI5.Recipe[0].UserParameter[0].Description',
  updateEvent: 'updateEvMI5.Recipe[0].UserParameter[0].Description',
  containerId: 'idec03356d4e06245edec6cf85c44d3642' }
  ];

console.log('))))))))))))))))))))))))))))))))))))))');

function createObjectOutOfNode(item){
  var nodeElements = splitNodeId(item.nodeId);
  var last = _.last(nodeElements);
  if(!detectIfArray(last)){
    var temp = {};
    temp[last] = item;
  }
  
  // now cut of last and look at the next
  nodeElements.pop();
  var last = _.last(nodeElements);
  if(!detectIfArray(last)){
    var temp2 = {};
    temp2[last] = temp;
  } else {
    last = stripArray(last);
    var temp2 = {};
    temp2[last] = [temp];
  }

  // now cut of last and look at the next
  nodeElements.pop();
  var last = _.last(nodeElements);
  if(!detectIfArray(last)){
    var temp3 = {};
    temp3[last] = temp2;
  } else {
    last = stripArray(last);
    var temp3 = {};
    temp3[last] = [temp2];
  }
  
  // now cut of last and look at the next
  nodeElements.pop();
  var last = _.last(nodeElements);
  if(last){
  if(!detectIfArray(last)){
    var temp4 = {};
    temp4[last] = temp3;
  } else {
    last = stripArray(last);
    var temp4 = {};
    temp4[last] = [temp3];
  }
  } else {
    var temp4=temp3;
  }
  
  // now cut of last and look at the next
  nodeElements.pop();
  var last = _.last(nodeElements);
  if(last){
  if(!detectIfArray(last)){
    var temp5 = {};
    temp5[last] = temp4;
  } else {
    last = stripArray(last);
    var temp5 = {};
    temp5[last] = [temp4];
  }
  } else {
    var temp5=temp4;
  }
  
  var output = temp5;
  return output;
}

var output = createObjectOutOfNode(test[1]);
console.log(JSON.stringify(output, null, 1));
var output2 = createObjectOutOfNode(test[5]);
console.log(JSON.stringify(output2, null, 1));


//
//test.forEach(function(item){
//  var nodeElements = splitNodeId(item.nodeId);
//  var last = _.last(nodeElements);
//  if(!detectIfArray(last)){
//    var temp = {};
//    temp[last] = item;
//  }
//  
//});
/*
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
