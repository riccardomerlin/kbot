'use strict';

// node modules requiring
const path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    helmet = require('helmet'),

    // configuration
    config = require('./config'),

    // custom modules requiring
    common = require('./common');

// init
const log = common.log,
    app = express();

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded sented by Slack HTTP post
app.use(bodyParser.urlencoded({ extended: true }));
// setting http headers properly for security
app.use(helmet());

app.get('/', function (req, res) {
    res.send('Kbot is up');
});

app.post('/slack/command-listener', function (req, res) {
    res.type('json');

    if (req.body.team_id !== process.env.SLACK_TEAM_ID) {
        res.status(403).json({
            'response_type': 'ephimeral',
            'text': 'This team is not allowed to use kbot.'
        });
        return;
    }

    let command = config.commands[req.body.command];
    let responseMessage = command(req.body);

    res.send(responseMessage);
});

let httpServer = http.createServer(app);
let port = process.env.PORT || 8080;
httpServer.listen(port, function listening() {
    console.log('kbot is listening on port %d', port);
});
