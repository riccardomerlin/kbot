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

    if (req.body.token !== process.env.slackCommandToken) {
        res.status(403).json({
            'response_type': 'in_channel',
            'text': 'Sorry, you are not allowed to interact with this endpoint.'
        });
        return;
    }

    let command = config.commands[req.body.command];
    let responseMessage = command(req.body.text, req.body.user_id, req.body.response_url);

    res.send(responseMessage);
});

let httpServer = http.createServer(app);
let port = process.env.PORT || 8080;
httpServer.listen(port, function listening() {
    console.log('kbot is listening on port %d', port);
});
