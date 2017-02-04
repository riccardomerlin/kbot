const path = require('path');
const common = require('../../common');
const actions = require(path.resolve(__dirname, './actions'));
const help = require('../shared/help.action');
const slackUtils = require('../../slack-utils');
const catchError = slackUtils.catchError;
const log = common.log;

module.exports = ktfsCommand;

/**
 * ktfs commands interpreter
 * @constructor
 * @param {object} params - data sent from a Slack command
 * @param {string} responseUri - uri of the Slack incoming hook to send the result of async operations
 */
function ktfsCommand(text, responseUri) {
    try {
        var paramsArray = text.split(' ');
        var actionName = paramsArray.shift();

        if (actionName == 'help') {
            help(responseUri, '/ktfs', 'ktfs is a TFS Slack integration - This is what you can do with /ktfs:', actions);
        }
        else {
            var action = actions[actionName];
            Object.keys(action.params).map(function (paramName) {
                if (paramsArray.length > 0) {
                    action.params[paramName] = paramsArray.shift().split(':')[1];
                    log.info(paramName + ': ' + action.params[paramName]);
                }
            });

            log.info('params: ' + JSON.stringify(action.params));
            action.method(responseUri, action.params);
        }
    }
    catch (e) {
        catchError('Invalid command `' + actionName + '`', responseUri, true);
    }
}