'use strict';

const path = require('path'),
    common = require('../../common'),
    actions = require(path.resolve(__dirname, './ktfs.actions')),
    help = require('../shared/help.action'),
    slackUtils = require('../../slack-utils'),

    catchError = slackUtils.catchError,
    log = common.log;

module.exports = ktfsCommand;

/**
 * ktfs command interpreter
 * 
 * @param {json object} data - The request body from Slack
 */
function ktfsCommand(data) {
    if (data.token !== process.env.KTFS_CMD_TOKEN) {
        log.error('Given token does not match the KTFS_CMD_TOKEN environment variable value.');
        return {
            'response_type': 'ephimeral',
            'text': 'Sorry, ktfs command is not enabled on your installation.'
        };
    }

    var promise = new Promise(function (resolve, reject) {
        execAction(data.text, data.user_id, data.response_url, callback);

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
        'response_type': data.text.indexOf('help') > -1
            || data.text.indexOf('register') > -1
            || data.text.indexOf('userinfo') > -1 ? 'ephemeral' : 'in_channel',
        'text': 'Request in progress...'
    };

    function onResolve() {
        // noop
    }

    function onReject(e) {
        catchError(e.message, responseUri, true);
    }
}

function execAction(text, userId, responseUri, callback) {
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

        callback();
    }
}