// node modules requiring
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

// custom modules requiring
const ktfsCommand = require('./k-commands/ktfs/ktfs.command');
const common = require('./common');

const log = common.log;
const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

    switch (req.body.command) {
        case '/ktfs':
            ktfsCommand(req.body.text, req.body.response_url);
            break;
        default:
            break;
    }

    res.send({
        'response_type': 'in_channel',
        'text': ''
    });
});

var httpServer = http.createServer(app);
httpServer.listen(process.env.PORT);
