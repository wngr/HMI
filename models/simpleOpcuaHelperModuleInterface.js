var _ = require('underscore');

/**
 * Splint nodeId into single elements
 * 
 * @param nodeId
 *          (e.g.'MI5.Recipe[0].UserParameter[0].Name')
 * @returns array (e.g. [ 'MI5', 'Recipe[0]', 'UserParameter[0]', 'Name' ])
 */
function _splitNodeId(nodeId) {
  var exp = /\w*[0-9]?/g
  var result = nodeId.match(exp);
  result = _.compact(result); // [ 'MI5', 'Module2501', 'SkillInput', 'SkillInput2',
  // 'ParameterInput', 'ParameterInput4', 'Name' ]
  var temp = [];
  console.log(result);

  for (var i = 0; i <= result.length;) {
    var one = result[i];
    var two = result[(i + 1)];
    if (typeof two !== 'undefined') {
      twoWith = two;
      two = _stripArray(two);
    }

    // console.log(one, two);

    if (one == two) {
      // We got the old array structure (e.g. SkillInput)
      if (typeof one != 'undefined') {
        temp.push(twoWith);
      }
      i = i + 2;
    } else {
      if (typeof one != 'undefined') {
        temp.push(one);
      }
      i++;
    }

  }

  // Flatten, just to be sure
  temp = _.flatten(temp);

  // remove first element, module interface is just one nodeid element too much for mi5arraytoobject
  temp.shift();

  return _.flatten(temp);
  // return result;
}
exports.splitNodeId = _splitNodeId;

/**
 * Get last element in a nodeId
 * 
 * @param nodeId
 * @returns
 */
function _getLastElement(nodeId) {
  var split = _splitNodeId(nodeId);
  return _.last(split);
}
exports.getLastElement = _getLastElement;

/**
 * Detect if nodeId contains array-signature
 * 
 * @param node
 *          (e.g. Recipe[0], Name, UserParameter[1])
 * @return bool (e.g. true, false, true)
 */
function _detectIfArray(node) {
  var exp = /[a-zA-z]([0-9]{1,3}$)/
  if (node.match(exp)) {
    return true;
  } else {
    return false;
  }
}
exports.detectIfArray = _detectIfArray;

/**
 * deletes last element in a nodeId
 * 
 * @param nodeId
 *          <string> Mi5.Recipe[0].Value
 * @returns {String} Mi5.Recipe[0].
 */
function _cutLastElement(nodeId) {
  var split = _splitNodeId(nodeId);
  split.pop();
  var result = '';
  split.forEach(function(item) {
    result = result + item + '.';
  });
  return result;
}
exports.cutLastElement = _cutLastElement;

/**
 * Detect if nodeId contains array-signature and returns the number
 * 
 * @param node
 *          (e.g. Recipe[0], Name, UserParameter[1])
 * @return bool/int (e.g. 0, false, 1)
 */
function _detectArrayElement(node) {
  if (_detectIfArray(node)) {
    var exp = /([0-9]+)/
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
  var exp = /\D*/
  var result = node.match(exp);
  return result[0];
}
exports.stripArray = _stripArray;

/**
 * 
 * @param node
 *          <string> (e.g. 'Recipe0')
 * @return <string> (e.g. 0)
 */
function _stripArrayKey(node) {
  var exp = /[0-9]+/
  var result = node.match(exp);
  return result[1];
}
exports.stripArrayKey = _stripArrayKey;

/**
 * *magic* Maps mi5ReadArray complete node to a correspondant blank Object.
 * 
 * Tested for Tasks/ProductionList (3-dim) Tested for HandModule (2-dim)
 * 
 * We use dummy[node][i] as dummy.node[i]
 * 
 * e.g. {nodeId: ..., value: xx, ...} => {Name: {nodeId, value},... Skills: [{Dummy:...}]}
 * 
 * @author Thomas Frei
 * @date 2014-11-09
 * @param data
 *          <array>
 * @param dummyObject
 *          <object> (mixed object)
 * @returns
 */
function mapMi5ArrayToObject(data, dummyObject) {
  assert(_.isArray(data));
  assert(_.isObject(dummyObject));

  data
      .forEach(function(entry) {
        var splitNodeId = _splitNodeId(entry.nodeId); // [0]: MI5; [1]:
        // ProductionList[x]

        if (splitNodeId.length == 3) {
          // splitNodeId[2] // Name
          console.log(splitNodeId[2], entry);
          dummyObject[splitNodeId[2]] = entry;
        }
        if (splitNodeId.length == 4) {
          // splitNodeId[2] // Skill[x]
          // splitNodeId[3] // Name
          skillArrayName = _stripArray(splitNodeId[2]);
          skillArrayElement = _detectArrayElement(splitNodeId[2]);
          console.log(skillArrayName, skillArrayElement, splitNodeId[3]);
          dummyObject[skillArrayName][skillArrayElement][splitNodeId[3]] = entry;
        }
        if (splitNodeId.length == 5) {
          // splitNodeId[2] // Skill[x]
          // splitNodeId[3] // UserParameter[y]
          // splitNodeId[4] // Name
          skillArrayName = _stripArray(splitNodeId[2]);
          skillArrayElement = _detectArrayElement(splitNodeId[2]);

          parameterArrayName = _stripArray(splitNodeId[3]);
          parameterArrayElement = _detectArrayElement(splitNodeId[3]);

          dummyObject[skillArrayName][skillArrayElement][parameterArrayName][parameterArrayElement][splitNodeId[4]] = entry;
        }

      });

  return dummyObject;
}
exports.mapMi5ArrayToObject = mapMi5ArrayToObject;

/**
 * Creates an array [startpoint,1,2,3,4,..., endpoint]
 * 
 * @param startpoint
 * @param endpoint
 * @returns {Array}
 */
function _123n(startpoint, endpoint) {
  var output = [];
  for (var i = startpoint; i <= endpoint; i++) {
    output.push(i);

    if (i == endpoint) {
      return output;
    }
  }
}
exports._123n = _123n;