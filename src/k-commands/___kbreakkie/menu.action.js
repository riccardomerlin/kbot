'use strict';

const common = require('../../common'),
    slackUtils = require('../../slack-utils'),

    sendRequest = common.sendRequest,
    log = common.log,
    datetimeFormat = common.datetimeFormat,
    slackDelayedResponse = slackUtils.delayedResponse,
    catchError = slackUtils.catchError,
    Exception = common.exception;

module.exports = breakkieMenuAction;

/**
 * Get the breakkie menu.
 * 
 * @param {string} responseUri - uri of the Slack incoming hook to which send the result of async operations.
 * @param {string} user - Slack user object.
 * @param {object} params - on object that contains three parameters: id, project, branch.
 */
function breakkieMenuAction(responseUri, user, params) {
    let options = {
        uri: responseUri,
        body: {
            'response_type': 'ephimeral',
            'text': 'There you go the menu!'
        }
    };

    slackDelayedResponse(options);
}