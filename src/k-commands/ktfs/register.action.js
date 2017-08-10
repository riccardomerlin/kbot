'use strict';

const path = require('path'),
    db = require('../../db.connector'),
    common = require('../../common'),
    slackUtils = require('../../slack-utils'),

    catchError = slackUtils.catchError,
    log = common.log;

module.exports = register;

function register(responseUri, slackUserId, params) {
    if (!params.hasOwnProperty('tfsUser') && !params.hasOwnProperty('tfsToken')) {
        catchError('Cannot complete the registration process because of missing parameters.', responseUri, true, 'ephimeral');
        return;
    }

    let newUser = {
        $set: {
            username: slackUserId
        }
    };

    if (params.tfsUser) {
        newUser.$set['tfs.username'] = params.tfsUser;
    }

    if (params.tfsToken) {
        newUser.$set['tfs.token'] = params.tfsToken;
    }

    db.users.update({ username: slackUserId }, newUser, { upsert: true, returnUpdatedDocs: true }, onUpdate);

    function onUpdate(err, numReplaced, user) {
        if (err) {
            catchError('db.users.update() failed. {username: \'' + slackUserId + '\'}', responseUri, false, 'ephimeral');
            return;
        }

        if (!user.tfs || !user.tfs.username || !user.tfs.token) {
            db.users.remove({ username: slackUserId }, {}, function () {
                let options = {
                    uri: responseUri,
                    body: {
                        'response_type': 'ephimeral',
                        'text': 'Cannot complete this action because of incomplete user data.'
                    }
                };

                log.info('User object has incomplete data: ' + JSON.stringify(user));
                slackUtils.delayedResponse(options);
            });
            return;
        }

        let options = {
            uri: responseUri,
            body: {
                'response_type': 'ephimeral',
                'mrkdwn': true,
                'text': 'Great! You now ready to use `/ktfs` command.',
                'attachments': [
                    {
                        'mrkdwn_in': ['text'],
                        'color': 'good',
                        'text': 'Registered data:',
                        'fields': [
                            {
                                'title': 'TFS Username',
                                'value': user.tfs.username,
                                'short': true
                            },
                            {
                                'title': 'TFS access token',
                                'value': user.tfs.token,
                                'short': false
                            }
                        ],
                        'ts': Math.floor(new Date() / 1000)
                    }
                ]
            }
        };

        slackUtils.delayedResponse(options);
    }
}