const request = require('request');
const Promise = require('es6-promise').Promise;
const moment = require('moment');

const datetimeFormat = 'YYYY-MM-DD, hh:mm:ss';

module.exports = {
    sendRequest: sendRequest,
    log: {
        error: consoleError,
        info: consoleLog,
        ok: consoleOk
    },
    datetimeFormat: datetimeFormat
};

function sendRequest(options, responseUri) {
    const uri = responseUri;
    return new Promise(function (resolve, reject) {
        request(options, callback);

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve({ body: body, responseUri: uri });
            }
            else {
                reject({ error: error, response: response, responseUri: uri });
            }
        }
    });
}

function consoleError(message) {
    console.error(moment().format(datetimeFormat) + ' 500 ERROR - ' + message);
}

function consoleLog(message) {
    console.log(moment().format(datetimeFormat) + ' ' + message);
}

function consoleOk(message) {
    console.log(moment().format(datetimeFormat) + ' 200 OK - ' + message);
}