module.exports = {
  getHelpDescription: getHelpDescription,
  buildDescription: buildDescription
};

/**
 * This method return the Help description for each action in the object
 * @param {object} actions - Contains a list of actions
 * @param {string} commandName - The name of the command that the action belongs to
 */
function getHelpDescription(actions, commandName) {
  return Object.keys(actions).reduce(function (seed, actionName) {
    var action = actions[actionName];
    return seed + buildDescription(actionName, commandName, action.description, action.params);
  }, '');
}

/**
 * This method return a string that describe the action
 * @param {string} actionName - The name of the action
 * @param {string} commandName - The name of the command that the action belongs to
 * @param {string} description - The action description property
 * @param {object} params - Object that contains the parameters of the action
 */
function buildDescription(actionName, commandName, description, params) {
  return '*' + description + '*'
    + '\n'
    + commandName + ' '
    + actionName + ' '
    + Object.keys(params).reduce(function (s, p) {
      return s + p + ':{value} '
    }, '')
    + '\n\n';
}