const slackUtils = require('../../slack-utils');
const slackDelayedResponse = slackUtils.delayedResponse

module.exports = getHelpInfo;

function getHelpInfo(responseUri, commandName, description, actions) {
    var actionDescriptions = Object.keys(actions).reduce(function (str, actionName) {
        var action = actions[actionName];
        return str + '*' + action.description + '*'
            + '\n'
            + commandName + ' '
            + actionName + ' '
            + Object.keys(action.params).reduce(function (s, p) {
                return s + p + ':{value} '
            }, '')
            + '\n\n';
    }, '');

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