const path = require('path');
const slackUtils = require('../../slack-utils');
const slackDelayedResponse = slackUtils.delayedResponse
const actionUtil = require(path.resolve(__dirname, 'action.util'));

module.exports = getHelpInfo;

function getHelpInfo(responseUri, commandName, description, actions) {
    var actionDescriptions = actionUtil.getHelpDescription(actions, commandName);

    var body = {
        'mrkdwn': true,
        'text': description + '\n\n'
        + actionDescriptions
    };

    var options = {
        uri: responseUri,
        method: 'POST',
        json: true,
        body: body
    };

    slackDelayedResponse(options);
}