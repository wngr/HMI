var _ = require('underscore');

/**
 * Splint nodeId into single elements
 * 
 * @param nodeId
 *          (e.g.'MI5.Recipe[0].UserParameter[0].Name')
 * @returns array (e.g. [ 'MI5', 'Recipe[0]', 'UserParameter[0]', 'Name' ])
 */
function _splitNodeId(nodeId) {
  var exp = /\w*\[?[0-9]*\]?/g
  var result = nodeId.match(exp);
  result = _.compact(result);
  return result;
}
exports.splitNodeId = _splitNodeId;

/**
 * Detect if nodeId contains array-signature
 * 
 * @param node
 *          (e.g. Recipe[0], Name, UserParameter[1])
 * @return bool (e.g. true, false, true)
 */
function _detectIfArray(node) {
  var exp = /\[([0-9]+)\]/
  if (node.match(exp)) {
    return true;
  } else {
    return false;
  }
}
exports.detectIfArray = _detectIfArray;

/**
 * Detect if nodeId contains array-signature and returns the number
 * 
 * @param node
 *          (e.g. Recipe[0], Name, UserParameter[1])
 * @return bool/int (e.g. 0, false, 1)
 */
function _detectArrayElement(node) {
  if (_detectIfArray(node)) {
    var exp = /\[([0-9]+)\]/
    var match = node.match(exp);
    return match[1];
  } else {
    return false;
  }
}
exports.detectArrayElement = _detectArrayElement;

/**
 * 
 * @param node
 *          <string> (e.g. 'MI5', 'Recipe[0]')
 * @return <string> (e.g. MI5, Recipe)
 */
function _stripArray(node) {
  var exp = /\w*/
  var result = node.match(exp);
  return result[0];
}
exports.stripArray = _stripArray;

/**
 * 
 * @param node
 *          <string> (e.g. 'Recipe[0]')
 * @return <string> (e.g. 0)
 */
function _stripArrayKey(node) {
  var exp = /([0-9])+/
  var result = node.match(exp);
  return result[1];
}
exports.stripArrayKey = _stripArrayKey;