'use strict';

const path = require('path'),
    db = require('../../db.connector'),
    slackUtils = require('../../slack-utils');

module.exports = function userInfo(responseUri, slackUserId, params) {
    db.users.findOne({ username: slackUserId }, onFound);

    function onFound(err, user) {
        if (err) {
            catchError('db.users.findOne() failed. {username: \'' + slackUserId + '\'}', responseUri, false, 'ephimeral');
            return;
        }

        let options = GetNotFoundUserOptions();
        if (user !== null) {
            options = GetFoundUserOptions(user);
        }

        slackUtils.delayedResponse(options);
    }

    function GetFoundUserOptions(user) {
        return {
            uri: responseUri,
            body: {
                'response_type': 'ephimeral',
                'attachments': [
                    {
                        'mrkdwn_in': ['text'],
                        'color': 'good',
                        'text': 'Your are registered for ktfs with the following data:',
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
    }

    function GetNotFoundUserOptions() {
        return {
            uri: responseUri,
            body: {
                'response_type': 'ephimeral',
                'text': 'sorry, your are not registered for ktfs service.'
            }
        };
    }
}