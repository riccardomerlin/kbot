'use strict';

const path = require('path'),
    common = require('../../common'),
    actions = require(path.resolve(__dirname, './actions')),
    help = require('../shared/help.action'),
    slackUtils = require('../../slack-utils'),

    catchError = slackUtils.catchError,
    log = common.log;

module.exports = ktfsCommand;

/**
 * ktfs commands interpreter
 * 
 * @param {string} text - text mesage sent from Slack
 * @param {string} responseUri - uri of the Slack incoming hook to send the result of async operations
 */
function ktfsCommand(text, userId, responseUri) {
    try {
        var paramsArray = text.split(' ');
        // get action name
        var actionName = paramsArray.shift();
        if (actionName == 'help') {
            help(responseUri, '/ktfs', 'ktfs is a TFS Slack integration - This is what you can do with /ktfs:', actions);
        }
        else {
            // crate params object
            var params = paramsArray.reduce(function (obj, currentValue) {
                let dictionary = currentValue.split(':');
                let key = dictionary[0];
                let value = dictionary[1];
                obj[key] = value;
                return obj;
            }, {});

            log.info('params: ' + JSON.stringify(params));
            
            var action = actions[actionName];
            action.method(responseUri, userId, params);
        }
    }
    catch (e) {
        catchError('Invalid action `' + actionName + '`', responseUri, true);
    }
}