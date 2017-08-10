'use strict';
const common = require('./common');

module.exports = tfsRestApi;

function tfsRestApi(serverUrl, username, authToken) {
    if (!serverUrl || !username || !authToken) {
        throw new Error('Cannot initialize object because of missing configuration.');
    }

    var tfs_uri = 'https://' + serverUrl;
    var api_version = 'api-version=2.0';

    this.createProject = function (projectName) {
        return new createProject(projectName);
    }

    this.get = {
        projects: getProjects
    }

    function createProject(projectName) {
        this.get = {
            definitions: getBuildDefinitions
        };

        this.queueNewBuild = queueNewBuild;

        function getBuildDefinitions(queryParams) {
            return callApi('/' + projectName + '/_apis/build/definitions', 'GET', queryParams);
        }

        function queueNewBuild(body) {
            return callApi('/' + projectName + '/_apis/build/builds', 'POST', '', body);
        }
    }

    function getProjects(queryParams) {
        return callApi('/_apis/projects', 'GET', queryParams);
    }

    function callApi(apiUrlSegment, method, queryParams, body) {
        let uri = Object.keys(queryParams).reduce(function (prev, current) {
            return prev + '&' + current + '=' + queryParams[current];
        }, tfs_uri + apiUrlSegment + '?' + api_version);

        let base64AuthToken = new Buffer(username + ':' + authToken).toString('base64');
        let options = {
            uri: uri,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64AuthToken
            },
            json: true,
            body: body
        };

        return common.sendRequest(options);
    }
}


