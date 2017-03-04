// node modules requiring
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const helmet = require('helmet');

// custom modules requiring
const ktfsCommand = require('./k-commands/ktfs/ktfs.command');
const common = require('./common');

const log = common.log;
const app = express();

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

    switch (req.body.command) {
        case '/ktfs':
            ktfsCommand(req.body.text, req.body.user_id, req.body.response_url);
            break;
        default:
            break;
    }

    res.send({
        'response_type': req.body.text.indexOf('help') > -1
            || req.body.text.indexOf('register') > -1
            || req.body.text.indexOf('userinfo') > -1 ? 'ephemeral' : 'in_channel',
        'text': ''
    });
});

var httpServer = http.createServer(app);
httpServer.listen(process.env.PORT, function listening() {
    console.log('kbot is listening on port %d', process.env.PORT);
});
