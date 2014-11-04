/**
 * 
 */

/*********************************************************************************
 * ModuleInterface
 */

/**
 * Generate single ParameterOutput nodeIds.
 * 
 * @param nodeIdToParameterSet
 *          e.g. 'MI5.Module1101.Output.SkillOutput.SkillOutput0.ParameterOutput'
 * @param numberOfParameter
 *          e.g. 0-5
 */
function ParameterOutputSingle(nodeIdToParameterSet, numberOfParameter) {
  // var endParameter = 0; // for i=0 i<=0 //on time
  var parameterArray = [ 'Dummy', 'ID', 'Name', 'Unit', 'Required', 'Default', 'MinValue',
      'MaxValue' ];
  var path = nodeIdToParameterSet + '.ParameterOutput' + numberOfParameter + '.';

  // Add the path to the node
  parameterArray = _.map(parameterArray, function(node) {
    return path + node;
  });

  return parameterArray;
}
exports.ParameterOutputSingle = ParameterOutputSingle;

/**
 * Generate single ParameterInput nodeIds
 * 
 * @param nodeIdToParameterSet
 *          e.g. 'MI5.Module1101.Input.SkillInput.SkillInput0.ParameterInput'
 * @param numberOfParameter
 *          e.g. 0-5
 */
function ParameterInputSingle(nodeIdToParameterSet, numberOfParameter) {
  // var endParameter = 0; // for i=0 i<=0 //on time
  var parameterArray = [ 'Value', 'StringValue' ];
  var path = nodeIdToParameterSet + '.ParameterInput' + numberOfParameter + '.';

  // Add the path to the node
  parameterArray = _.map(parameterArray, function(node) {
    return path + node;
  });

  return parameterArray;
}
exports.ParameterInputSingle = ParameterInputSingle;

/**
 * Generate single SkillOutput nodeIds.
 * 
 * @param nodeIdToParameterSet
 *          e.g. 'MI5.Module1101.Output.SkillOutput'
 * @param numberOfParameter
 *          e.g. 0-15
 */
function SkillOutputSingle(nodeIdToSkillOutput, numberOfSkill) {
  var skillArray = [ 'Dummy', 'ID', 'Name', 'Activated', 'Ready', 'Busy', 'Done', 'Error' ];
  var path = nodeIdToSkillOutput + '.SkillOutput' + numberOfSkill + '.';

  // Add the path to every node
  skillArray = _.map(skillArray, function(node) {
    return path + node;
  });

  return skillArray;
}
exports.SkillOutputSingle = SkillOutputSingle;

/**
 * Generate single SkillInput nodeIds.
 * 
 * @param nodeIdToParameterSet
 *          e.g. 'MI5.Module1101.Input.SkillInput'
 * @param numberOfParameter
 *          e.g. 0-15
 */
function SkillInputSingle(nodeIdToSkill, numberOfSkill) {
  var skillArray = [ 'Execute' ];
  var path = nodeIdToSkill + '.SkillInput' + numberOfSkill + '.';

  // Add the path to every node
  skillArray = _.map(skillArray, function(node) {
    return path + node;
  });

  return skillArray;
}
exports.SkillInputSingle = SkillInputSingle;

/**
 * Read ModuleOutput: MI5.ModuleXXXX.Output
 * 
 * @param nodeIdToParameterSet
 *          e.g. 'MI5.Module1101.Output.SkillOutput'
 * @param numberOfParameter
 *          e.g. 0-15
 */
function ModuleOutput(nodeIdToModuleOutput) {
  // var endSkill = 15;
  var moduleArray = [ 'Dummy', 'Connected', 'ConnectionTestOutput', 'CurrentTaskDescription',
      'Error', 'ErrorDescription', 'ErrorID', 'ID', 'Idle', 'Name', 'PositionSensor' ];
  var path = nodeIdToModuleOutput + '.';

  // Add the path to the node
  moduleArray = _.map(moduleArray, function(node) {
    return path + node;
  });

  return moduleArray;
}
exports.ModuleOutput = ModuleOutput;

/***************************************************************************************************
 * RecipeInterface
 */

function recipe(nodeId) {
  var array = [ 'Dummy', 'Name', 'ID', 'Description' ];

  array = _.map(array, function(element) {
    return nodeId + '.' + element;
  });

  return array
}
exports.recipe = recipe;

function recipeUserParameter(nodeId) {
  var array = [ 'Dummy', 'Name', 'Description', 'Unit', 'Default', 'MinValue', 'MaxValue' ];

  array = _.map(array, function(element) {
    return nodeId + '.' + element;
  });
  exports.recipeUserParameter = recipeUserParameter;

  return array
}
exports.recipeUserParameter = recipeUserParameter;
