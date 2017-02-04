const common = require('../../common');
const slackUtils = require('../../slack-utils');

const sendRequest = common.sendRequest;
const log = common.log;
const datetimeFormat = common.datetimeFormat;
const slackDelayedResponse = slackUtils.delayedResponse
const catchError = slackUtils.catchError;

module.exports = queueNewBuild;

/**
 * Queue a new buil on Microsoft TFS.
 * @constructor
 * @param {string} responseUri - uri of the Slack incoming hook to send the result of async operations
 * @param {array} params - An array of strings that contains builDefinitionId, projectName and branchName (optional).
 */
function queueNewBuild(responseUri, params) {
    /*  
    params = id:7 project:rm.ilcenacolo branch:master
    */
    var buildDefinitionId = params.id;
    var projectName = params.project;
    var branchName = params.branch;

    try {
        var payload = {
            definition: {
                id: buildDefinitionId
            },
            sourceBranch: branchName
        };

        var options = {
            uri: 'https://' + process.env.TFSUrl + '/' + projectName + '/_apis/build/builds?api-version=2.0',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + process.env.TFSAccessToken
            },
            json: true,
            body: payload
        };

        var promise = sendRequest(options, responseUri);
        promise.then(tfsSuccess, tfsError);
    } catch (e) {
        catchError(e, responseUri);
    }
}

function tfsSuccess(result) {
    log.ok('New TFS build has been queued: Build ' + result.body.buildNumber + ', url' + result.body._links.web.href);
    log.info('responseUri: ' + result.responseUri);
    var body = {
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

    var options = {
        uri: result.responseUri,
        method: 'POST',
        json: true,
        body: body
    };
    slackDelayedResponse(options);
}

function tfsError(data) {
    catchError(data.error ? data.error : data.response.body.message, data.responseUri, data.error ? false : true)
}