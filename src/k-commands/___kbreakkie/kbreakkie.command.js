'use strict';

const path = require('path'),
    common = require('../../common'),
    actions = require(path.resolve(__dirname, './kbreakkie.actions')),
    help = require('../shared/help.action'),
    slackUtils = require('../../slack-utils'),

    catchError = slackUtils.catchError,
    log = common.log;

module.exports = kbreakkieCommand;

/**
 * kbreakkie command interpreter
 * 
 * @param {string} text - text mesage sent from Slack
 * @param {string} userId - Slack user id
 * @param {string} responseUri - uri of the Slack incoming hook to which send the result of async operations
 */
function kbreakkieCommand(data) {
    // token, text, userId, responseUri
    if (data.token !== process.env.KBREAKKIE_CMD_TOKEN) {
        log.error('Given token does not match the KBREAKKIE_CMD_TOKEN environment variable value.');
        return {
            'response_type': 'ephimeral',
            'text': 'Sorry, kbreakkie command is not enabled on your installation.'
        };
    }

    var promise = new Promise(function (resolve, reject) {
        let paramsArray = data.text.split(' ');

        // get action name
        let actionName = paramsArray.shift();
        execAction(actionName, paramsArray, { userId: data.user_id, username: data.user_name }, data.response_url, callback);

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
        'response_type': 'ephimeral',
        'text': 'Request in progress...'
    };

    function onResolve() {
        // noop
    }

    function onReject(e) {
        catchError(e.message, responseUri, true);
    }
}

function execAction(actionName, paramsArray, user, responseUri, callback) {
    if (actionName == 'help') {
        help(responseUri,
            '/kbreakkie',
            'kbreakkie makes you Friday\'s Breakfast easier! - This is what you can do with /kbreakkie:',
            actions);
    }
    else {
        let action = actions[actionName];
        if (typeof action === 'undefined') {
            callback({
                exception: '',
                message: 'Invalid action `' + actionName + '`'
            });
            return;
        }

        let params = {};
        if (Object.keys(action.params).length === 0) {
            params.text = paramsArray.join(' ');
        } else {
            // crate params object
            params = paramsArray.reduce(function (obj, currentValue) {
                let dictionary = currentValue.split(':');
                let key = dictionary[0];
                let value = dictionary[1];
                obj[key] = value;
                return obj;
            }, {});
        }

        action.method(responseUri, user, params);

        callback(null);
    }
}
