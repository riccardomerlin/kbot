'use strict';

const common = require('../../common'),
    slackUtils = require('../../slack-utils'),

    sendRequest = common.sendRequest,
    log = common.log,
    datetimeFormat = common.datetimeFormat,
    slackDelayedResponse = slackUtils.delayedResponse,
    catchError = slackUtils.catchError,
    Exception = common.exception;

module.exports = scheduler;

/**
 * Control the scheduler.
 * 
 * @param {string} responseUri - uri of the Slack incoming hook to which send the result of async operations.
 * @param {string} userId - Slack user id.
 * @param {object} params - on object that contains three parameters: id, project, branch.
 */
function scheduler(responseUri, userId, params) {
    let options = {
        uri: responseUri,
        body: {
            'response_type': 'ephimeral',
            'text': 'Scheduler started!'
        }
    };

    slackDelayedResponse(options);
}