/**
 * Test regular Expressions
 */
var re = /\w+\s/g;
var str = "fee fi fo fum";
var myArray = str.match(re);
console.log(myArray);

var exp = /\.\w*$/
var nodeId = 'MI5.Module1101.Output.SkillOutput.SkillOutput0.Error';
console.log( exp.exec(nodeId) );
console.log( nodeId.match(exp) );

console.log( nodeId.match(exp)[0].slice(1) );