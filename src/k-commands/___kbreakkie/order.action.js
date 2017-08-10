'use strict';

const common = require('../../common'),
    path = require('path'),
    db = require(path.resolve(__dirname, './kbreakkie.db.connector')),
    slackUtils = require('../../slack-utils'),

    sendRequest = common.sendRequest,
    log = common.log,
    datetimeFormat = common.datetimeFormat,
    slackDelayedResponse = slackUtils.delayedResponse,
    catchError = slackUtils.catchError,
    Exception = common.exception;

module.exports = orderAction;

/**
 * Place an order for breakfast.
 * 
 * @param {string} responseUri - uri of the Slack incoming hook to which send the result of async operations.
 * @param {string} user - Slack user object.
 * @param {object} params - an object that contains the order's text.
 */
function orderAction(responseUri, user, params) {
    let now = new Date();
    db.orders.update({ $where: condition },
        {
            datetime: now.getTime(),
            user: user,
            order: params.text
        },
        { upsert: true, returnUpdatedDocs: true },
        onUpdated);

    function onUpdated(err, numReplaced, order) {
        try {
            if (err || order === null) {
                log.error('Cannot place the order \'' + params.order + '\' for user \'' + userId + '\'.');
                throw new Exception('Cannot place the order. Try again.', true);
            }

            let options = {
                uri: responseUri,
                body: {
                    'response_type': 'ephimeral',
                    'text': 'Your order has been taken!'
                }
            };

            slackDelayedResponse(options);
        } catch (e) {
            let message = e;
            let display = false;
            if (e instanceof Exception) {
                message = e.message;
                display = e.display;
            }

            catchError(message, responseUri, display);
        }
    }

    function condition() {
        let d1 = now;
        let d2 = new Date(this.datetime);

        return this.user.userId === user.userId &&
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    }
}