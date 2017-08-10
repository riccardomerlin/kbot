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

module.exports = ordersAction;

/**
 * Get the list of orders for today's breakfast.
 * 
 * @param {string} responseUri - uri of the Slack incoming hook to which send the result of async operations.
 * @param {string} user - Slack user object.
 */
function ordersAction(responseUri, user) {
    db.orders.find({ $where: whereClause }, onFound);

    function onFound(err, orders) {
        try {
            if (err || orders === null) {
                log.error('Orders list error.');
                throw new Exception('Cannot retrieve the orders list. Try again.', true);
            }

            let fields = orders.map(function (order) {
                return {
                    'title': order.user.username,
                    'value': order.order,
                    'short': false
                }
            });

            let options = {
                uri: responseUri,
                body: {
                    'response_type': 'ephimeral',
                    'attachments': [
                        {
                            'title': 'Today\'s breakfast orders:',
                            'color': '#439FE0',
                            'fields': fields
                        }
                    ]
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

    function whereClause() {
        let d1 = new Date;
        let d2 = new Date(this.datetime);

        return d2.getDate() === d1.getDate() &&
            d2.getMonth() === d1.getMonth() &&
            d2.getFullYear() === d1.getFullYear();
    }
}