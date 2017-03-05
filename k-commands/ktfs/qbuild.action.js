'use strict';

const common = require('../../common'),
    slackUtils = require('../../slack-utils'),
    tfsApi = require('../../tfs-api'),
    db = require('../../db.connector'),

    sendRequest = common.sendRequest,
    log = common.log,
    datetimeFormat = common.datetimeFormat,
    slackDelayedResponse = slackUtils.delayedResponse,
    catchError = slackUtils.catchError,
    Exception = common.exception;

module.exports = queueNewBuild;

/**
 * Queue a new buil on Microsoft TFS.
 * 
 * @param {string} responseUri - uri of the Slack incoming hook to which send the result of async operations.
 * @param {string} userId - Slack user id.
 * @param {object} params - on object that contains three parameters: id, project, branch.
 */
function queueNewBuild(responseUri, userId, params) {
    db.users.find({ username: userId }, function (err, users) {
        try {
            if (err || users.length < 1) {
                log.error('User ' + userId + ' not registered.');
                throw new Exception('User is not yet registered. Use `/ktfs register tfsToken:<value> tfsUser:<value>`', true);
            }

            let user = users[0];
            const tfsCconnector = new tfsApi(process.env.TFSUrl, user.tfs.username, user.tfs.token);

            let project = tfsCconnector.createProject(params.project);

            let payload = {
                definition: {
                    id: params.id
                },
                sourceBranch: params.branch
            };

            let promise = project.queueNewBuild(payload);
            promise.then(
                (result) => { tfsSuccess(result, responseUri); },
                (result) => { tfsError(result, responseUri); }
            );
        } catch (e) {
            let message = e;
            let display = false;
            if (e instanceof Exception) {
                message = e.message;
                display = e.display;
            }

            catchError(message, responseUri, display);
        }
    });
}

function tfsSuccess(result, responseUri) {
    log.ok('New TFS build has been queued: Build ' + result.body.buildNumber + ', url' + result.body._links.web.href);
    log.info('responseUri: ' + responseUri);

    let body = {
        'response_type': 'in_channel',
        'mrkdwn': true,
        'attachments': [
            {
                'mrkdwn_in': ['text'],
                'color': 'good',
                'title': 'Build ' + result.body.buildNumber,
                'title_link': result.body._links.web.href,
                'text': 'New build successfully queued.',
                'fields': [
                    {
                        'title': 'Project',
                        'value': result.body.project.name,
                        'short': true
                    },
                    {
                        'title': 'Source branch',
                        'value': result.body.sourceBranch,
                        'short': true
                    },
                    {
                        'title': 'Definition',
                        'value': result.body.definition.name,
                        'short': false
                    },
                    {
                        'title': 'Definition url',
                        'value': result.body.definition.url,
                        'short': false
                    }
                ],
                'ts': Math.floor(new Date() / 1000)
            }
        ]
    };

    let options = {
        uri: responseUri,
        body: body
    };

    slackDelayedResponse(options);
}

function tfsError(data, responseUri) {
    catchError(data.error ? data.error : data.response.body.message, responseUri, data.error ? false : true)
}