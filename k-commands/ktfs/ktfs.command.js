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
 * @param {string} Slack user id
 * @param {string} responseUri - uri of the Slack incoming hook to which send the result of async operations
 */
function ktfsCommand(text, userId, responseUri) {
    var promise = new Promise(function (resolve, reject) {
        processCommand(text, userId, responseUri, callback);

        function callback(error) {
            if (!error) {
                resolve();
            }
            else {
                reject(error);
            }
        }
    });

    promise.then(onResolve, onReject);

    return {
        'response_type': text.indexOf('help') > -1
            || text.indexOf('register') > -1
            || text.indexOf('userinfo') > -1 ? 'ephemeral' : 'in_channel',
        'text': 'Request in progress...'
    };

    function onResolve() {
        // noop
    }

    function onReject(e) {
        catchError(e.message, responseUri, true);
    }
}

function processCommand(text, userId, responseUri, callback) {
    var paramsArray = text.split(' ');
    // get action name
    var actionName = paramsArray.shift();
    if (actionName == 'help') {
        help(responseUri, '/ktfs', 'ktfs is a TFS Slack integration - This is what you can do with /ktfs:', actions);
    }
    else {
        // crate params object
        let params = paramsArray.reduce(function (obj, currentValue) {
            let dictionary = currentValue.split(':');
            let key = dictionary[0];
            let value = dictionary[1];
            obj[key] = value;
            return obj;
        }, {});

        log.info('ktfs command params: ' + JSON.stringify(params));

        let action = actions[actionName];
        if (typeof action === 'undefined') {
            callback({
                exception: '',
                message: 'Invalid action `' + actionName + '`'
            });
            return;
        }

        action.method(responseUri, userId, params);

        callback(null);
    }
}